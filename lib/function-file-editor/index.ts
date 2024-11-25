// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// import { BsLayoutTextWindow } from "react-icons/bs"

import { Maoka, type TMaokaChildren } from "@ordo-pink/maoka"
import { BsLayoutTextWindow } from "@ordo-pink/frontend-icons"
import { MetadataIcon } from "@ordo-pink/maoka-components"
import { Result } from "@ordo-pink/result"
import { create_function } from "@ordo-pink/core"

import { FileEditorSidebar } from "./src/file-editor.sidebar"
import { FileEditorWorkspace } from "./src/file-editor.workspace"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Switch } from "@ordo-pink/switch"

declare global {
	interface cmd {
		file_editor: {
			open: () => void
			open_file: () => Ordo.Metadata.FSID
		}
	}

	interface t {
		file_editor: {
			command_palette: {
				open: () => string
				open_file: () => string
			}
		}
	}
}

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
		],
		queries: [
			"data.metadata_query",
			"application.current_route",
			"users.users_query",
			"data.content_query",
			"functions.file_associations",
		],
	},
	ctx => {
		const { on, emit } = ctx.get_commands()
		const metadata_query = ctx.get_metadata_query()

		on("cmd.file_editor.open", () => emit("cmd.application.router.navigate", "/editor"))
		on("cmd.file_editor.open_file", x => emit("cmd.application.router.navigate", `/editor/${x}`))

		emit("cmd.application.add_translations", {
			lang: "en",
			translations: {
				"t.file_editor.command_palette.open": "Open File Editor",
				"t.file_editor.command_palette.open_file": "Open in File Editor...",
			},
		})

		emit("cmd.application.command_palette.add", {
			on_select: () => emit("cmd.file_editor.open"),
			readable_name: "t.file_editor.command_palette.open",
			hotkey: "mod+e",
			render_icon: div => void div.appendChild(BsLayoutTextWindow() as SVGSVGElement),
		})

		emit("cmd.application.command_palette.add", {
			on_select: () =>
				metadata_query.pipe(Result.ops.chain(query => query.get())).cata(
					Result.catas.if_ok(metadata =>
						emit("cmd.application.command_palette.show", {
							items: metadata.map(metadata_to_command_palette_item(ctx, emit)),
							max_items: 20,
						}),
					),
				),
			readable_name: "t.file_editor.command_palette.open_file",
			hotkey: "mod+p",
			render_icon: div => void div.appendChild(BsLayoutTextWindow() as SVGSVGElement),
		})

		emit("cmd.functions.activities.register", {
			fid: ctx.fid,
			activity: {
				name: "pink.ordo.editor.activity",
				routes: ["/editor", "/editor/:fsid"],
				render_icon: div => void div.appendChild(BsLayoutTextWindow() as SVGSVGElement),
				render_workspace: div => Maoka.render_dom(div, FileEditorWorkspace(ctx)),
				render_sidebar: div => Maoka.render_dom(div, FileEditorSidebar(ctx)),
			},
		})
	},
)

// TODO Move to core
const WithCtx = (ctx: Ordo.CreateFunction.Params) => (children: () => TMaokaChildren) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaOrdo.Context.provide(ctx))

		return children
	})

const metadata_to_command_palette_item =
	(ctx: Ordo.CreateFunction.Params, emit: Ordo.Command.Commands["emit"]) =>
	(metadata: Ordo.Metadata.Instance): Ordo.CommandPalette.Item => {
		const metadata_query = ctx.get_metadata_query().unwrap() as Ordo.Metadata.Query

		const path = metadata_query
			.get_ancestors(metadata.get_fsid())
			.pipe(Result.ops.map(ancestors => get_path(ancestors)))
			.pipe(Result.ops.map(path => `/ ${path}`))
			.cata(Result.catas.or_else(() => "/"))

		return {
			on_select: () => emit("cmd.file_editor.open_file", metadata.get_fsid()),
			readable_name: metadata.get_name() as Ordo.I18N.TranslationKey,
			render_custom_info: () => FilePath(() => path),
			render_icon: div => {
				const Provider = WithCtx(ctx)

				return Maoka.render_dom(
					div,
					Provider(() => MetadataIcon({ metadata })),
				)
			},
		}
	}

const FilePath = Maoka.styled("div", {
	class: "text-xs shrink-0 text-neutral-600 dark:text-neutral-400",
})

// TODO Move to utils
const get_path = (ancestors: Ordo.Metadata.Instance[]) =>
	Switch.OfTrue()
		.case(ancestors.length > 0, () => ancestors.map(ancestor => ancestor.get_name()).join(" / "))
		.default(() => "")
