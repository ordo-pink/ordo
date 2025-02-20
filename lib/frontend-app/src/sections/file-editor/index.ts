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

import { BsBoxArrowUp, BsCloudMinus, BsCloudPlus, BsLayoutTextWindow } from "@ordo-pink/frontend-icons"
import { CommandPaletteItemType, ContextMenuItemType, Metadata, RRR, create_function } from "@ordo-pink/core"
import { Oath, invokers0 } from "@ordo-pink/oath"
import { Maoka } from "@ordo-pink/maoka"
import { MetadataIcon } from "@ordo-pink/maoka-components"
import { R } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"
import { TwoLetterLocale } from "@ordo-pink/locale"

import { FileEditorSidebar } from "./file-editor.sidebar"
import { FileEditorWorkspace } from "./file-editor.workspace"
import { PublishMetadataModal } from "./components/file-editor-publish-modal.component"
import { ordo_app_state } from "../../../app.state"

import core_styles from "@ordo-pink/frontend-app/index.css?inline"
import maoka_components from "@ordo-pink/maoka-components/maoka-components.css?inline"

export default create_function(
	"pink.ordo.editor",
	{
		commands: [
			"cmd.application.add_translations",
			"cmd.application.command_palette.add",
			"cmd.application.command_palette.hide",
			"cmd.application.command_palette.show",
			"cmd.application.context_menu.add",
			"cmd.application.context_menu.show",
			"cmd.application.modal.show",
			"cmd.application.notification.show",
			"cmd.application.router.navigate",
			"cmd.application.router.open_external",
			"cmd.application.set_title",
			"cmd.content.upload",
			"cmd.file_editor.open_file",
			"cmd.file_editor.open",
			"cmd.functions.activities.register",
			"cmd.metadata.remove_labels",
			"cmd.metadata.remove",
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
			"metadata.get_by_name",
			"metadata.has_children",
			"user.get_current",
		],
	},
	state => {
		const commands = state.commands
		const metadata_query = state.metadata_query

		commands.on("cmd.file_editor.open", () => void commands.emit("cmd.application.router.navigate", { url: "/editor" }))
		commands.on(
			"cmd.file_editor.open_file",
			x => void commands.emit("cmd.application.router.navigate", { url: `/editor/${x}` }),
		)

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

		commands.on(
			"cmd.metadata.show_publish_modal",
			fsid => void commands.emit("cmd.application.modal.show", { render: () => PublishMetadataModal(fsid) }),
		)

		commands.on("cmd.metadata.unpublish", fsid => {
			metadata_query
				.get_by_fsid(fsid)
				.pipe(R.ops.chain(R.FromNullable))
				.pipe(
					R.ops.chain(metadata =>
						R.FromNullable(metadata.get_property("public_id"))
							.pipe(R.ops.chain(x => R.If(Metadata.Validations.is_fsid(x), { T: () => x as Ordo.Metadata.FSID })))
							.pipe(R.ops.map(pub_fsid => commands.emit("cmd.metadata.remove", pub_fsid)))
							.pipe(R.ops.map(() => commands.emit("cmd.metadata.set_property", { fsid, key: "public_id", value: void 0 }))),
					),
				)
		})

		commands.on("cmd.metadata.open_published_page", fsid => {
			const user = ordo_app_state.zags.select("auth.user")
			const pb_host = ordo_app_state.zags.select("hosts.pb")

			user &&
				commands.emit("cmd.application.router.open_external", { url: `${pb_host}/${user.get_id()}/${fsid}`, new_tab: true })
		})

		commands.emit("cmd.application.context_menu.add", {
			command: "cmd.metadata.show_publish_modal",
			payload_creator: ({ payload }) => (payload as Ordo.Metadata.Instance).get_fsid(),
			readable_name: "Publish..." as any, // TODO i18n
			render_icon: BsCloudPlus,
			should_show: ({ payload }) => Metadata.Validations.is_metadata(payload) && !payload.get_property("public_id"),
			type: ContextMenuItemType.CREATE,
		})

		commands.emit("cmd.application.context_menu.add", {
			command: "cmd.metadata.open_published_page",
			payload_creator: ({ payload }) => (payload as Ordo.Metadata.Instance).get_fsid(),
			readable_name: "Open published page" as any, // TODO i18n
			render_icon: BsBoxArrowUp,
			should_show: ({ payload }) => Metadata.Validations.is_metadata(payload) && !!payload.get_property("public_id"),
			type: ContextMenuItemType.READ,
		})

		commands.emit("cmd.application.context_menu.add", {
			command: "cmd.metadata.unpublish",
			payload_creator: ({ payload }) => (payload as Ordo.Metadata.Instance).get_fsid(),
			readable_name: "Unpublish" as any, // TODO i18n
			render_icon: BsCloudMinus,
			should_show: ({ payload }) => Metadata.Validations.is_metadata(payload) && !!payload.get_property("public_id"),
			type: ContextMenuItemType.DELETE,
		})

		commands.on("cmd.metadata.publish", fsid => {
			const content_query = state.content_query
			const metadata_query = state.metadata_query
			const metadata = metadata_query.get_by_fsid(fsid).cata(R.catas.or_else(() => null))
			const user = state.user_query.get_current().cata(R.catas.or_else(() => null))
			const fas = state.file_associations$.select("value")

			if (!metadata) return

			if (!user) throw RRR.codes.eperm(`Cannot publish '${metadata.get_name()}' because user is not authenticated`)

			const metadata_type = metadata.get_type()
			const fa = fas.find(fa => fa.types.some(type => type.name === metadata_type))

			// TODO Avoid rendering files if they should not be converted to text
			if (!fa) return

			void content_query
				.get(user.get_id(), fsid)
				.and(content =>
					Oath.FromNullable(fa)
						.and(fa => Oath.FromNullable(fa.content_to_string).fix(() => ({ render: () => "", styles: [] })))
						.and(({ render, styles }) =>
							Oath.FromNullable(render)
								.fix(() => () => "")
								.and(f => Oath.Merge({ str: f({ metadata, content, is_editable: false, is_embedded: false }), styles })),
						),
				)
				.and(({ str, styles }) => create_publishable_page(metadata.get_name(), str, ...(styles ?? [])))
				.and(content =>
					commands.emit("cmd.content.upload", {
						name: `.${metadata.get_name()}-pub`,
						parent: metadata.get_fsid(),
						content,
						type: "text/html",
					}),
				)
				.and(() => metadata_query.get_by_name(`.${metadata.get_name()}-pub`, metadata.get_fsid(), { show_hidden: true }))
				.and(r => r.cata({ Ok: m => Oath.Resolve(m), Err: () => Oath.Reject(null) }))
				.and(Oath.FromNullable)
				.and(public_metadata =>
					commands.emit("cmd.metadata.set_property", {
						fsid: metadata.get_fsid(),
						key: "public_id",
						value: public_metadata.get_fsid(),
					}),
				)
				.invoke(invokers0.to_promise)
		})

		commands.emit("cmd.application.command_palette.add", {
			value: () =>
				metadata_query.get().cata(
					R.catas.if_ok(metadata =>
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
			.pipe(R.ops.map(ancestors => get_path(ancestors)))
			.pipe(R.ops.map(path => `/ ${path}`))
			.cata(R.catas.or_else(() => "/"))

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

const create_publishable_page = (title: string, str: string, ...styles: string[]) => `<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="icon" href="/favicon.ico" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"
/>
<style>
${core_styles}
${maoka_components}
${styles.join("\n")}
</style>
</head>
<body>
${str}
</body>
</html>`
