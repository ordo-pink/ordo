/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { CommandPaletteItemType, create_function } from "@ordo-pink/core"
import { BsLayoutTextWindow } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { MetadataIcon } from "@ordo-pink/maoka-components"
import { Result } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"
import { TwoLetterLocale } from "@ordo-pink/locale"

import { FileEditorSidebar } from "./file-editor.sidebar"
import { FileEditorWorkspace } from "./file-editor.workspace"

export default create_function(
	"pink.ordo.editor",
	{
		commands: [
			"cmd.application.add_translations",
			"cmd.application.command_palette.add",
			"cmd.application.command_palette.hide",
			"cmd.application.command_palette.show",
			"cmd.application.context_menu.show",
			"cmd.application.notification.show",
			"cmd.application.router.navigate",
			"cmd.application.set_title",
			"cmd.file_editor.open_file",
			"cmd.file_editor.open",
			"cmd.functions.activities.register",
			"cmd.metadata.remove_labels",
			"cmd.metadata.rename",
			"cmd.metadata.set_property",
			"cmd.metadata.show_create_modal",
			"cmd.metadata.show_edit_label_modal",
			"cmd.metadata.show_edit_labels_palette",
			"cmd.metadata.show_edit_links_palette",
		],
		queries: [
			"application.file_associations",
			"application.router",
			"content.get",
			"metadata.$",
			"metadata.get_ancestors",
			"metadata.get_by_fsid",
			"metadata.get_children",
			"metadata.get_incoming_links",
			"metadata.get_outgoing_links",
			"metadata.get_parent",
			"metadata.get",
			"metadata.has_children",
		],
	},
	state => {
		const commands = state.commands
		const metadata_query = state.metadata_query

		commands.on("cmd.file_editor.open", () => commands.emit("cmd.application.router.navigate", { url: "/editor" }))
		commands.on("cmd.file_editor.open_file", x => commands.emit("cmd.application.router.navigate", { url: `/editor/${x}` }))

		commands.emit("cmd.application.add_translations", {
			lang: TwoLetterLocale.ENGLISH,
			translations: {
				"t.file_editor.command_palette.open": "Open File Editor",
				"t.file_editor.command_palette.open_file": "Open in File Editor...",
			},
		})

		commands.emit("cmd.application.command_palette.add", {
			value: () => commands.emit("cmd.file_editor.open"),
			readable_name: "t.file_editor.command_palette.open",
			type: CommandPaletteItemType.PAGE_OPENER,
			hotkey: "mod+e",
			render_icon: BsLayoutTextWindow,
		})

		commands.emit("cmd.application.command_palette.add", {
			value: () =>
				metadata_query.get().cata(
					Result.catas.if_ok(metadata =>
						commands.emit("cmd.application.command_palette.show", {
							items: metadata.map(metadata_to_command_palette_item(state)),
							max_items: 50,
							on_select: item => commands.emit("cmd.file_editor.open_file", item.value),
						}),
					),
				),
			type: CommandPaletteItemType.PAGE_OPENER,
			readable_name: "t.file_editor.command_palette.open_file",
			hotkey: "mod+p",
			render_icon: BsLayoutTextWindow,
		})

		commands.emit("cmd.functions.activities.register", {
			name: "pink.ordo.editor.activity",
			routes: ["/editor", "/editor/:fsid"],
			render_icon: BsLayoutTextWindow,
			render_workspace: () => FileEditorWorkspace,
			render_sidebar: () => FileEditorSidebar,
		})
	},
)

const metadata_to_command_palette_item =
	(state: Ordo.CreateFunction.State) =>
	(metadata: Ordo.Metadata.Instance): Ordo.CommandPalette.Item => {
		const metadata_query = state.metadata_query

		const path = metadata_query
			.get_ancestors(metadata.get_fsid())
			.pipe(Result.ops.map(ancestors => get_path(ancestors)))
			.pipe(Result.ops.map(path => `/ ${path}`))
			.cata(Result.catas.or_else(() => "/"))

		return {
			value: metadata.get_fsid(),
			readable_name: metadata.get_name() as Ordo.I18N.TranslationKey,
			render_custom_info: () => FilePath(() => path),
			render_icon: () => MetadataIcon({ metadata }),
		}
	}

const FilePath = Maoka.styled("div", {
	class: "text-xs text-neutral-600 dark:text-neutral-400 w-fit whitespace-nowrap",
})

// TODO Move to utils
const get_path = (ancestors: Ordo.Metadata.Instance[]) =>
	Switch.OfTrue()
		.case(ancestors.length > 0, () => ancestors.map(ancestor => ancestor.get_name()).join(" / "))
		.default(() => "")
