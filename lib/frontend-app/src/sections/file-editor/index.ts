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
import { CommandPaletteItemType, ContextMenuItemType, Metadata, create_function, rrr } from "@ordo-pink/core"
import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { MetadataIcon } from "@ordo-pink/maoka-components"
import { R } from "@ordo-pink/result"
import { sweech } from "@ordo-pink/sweech"
import { TWO_LETTER_LOCALE } from "@ordo-pink/locale"

import { FileEditorSidebar } from "./file-editor.sidebar"
import { FileEditorWorkspace } from "./file-editor.workspace"
import { PublishMetadataModal } from "./components/file-editor-publish-modal.component"
import { ordo_app_state } from "../../../app.state"

import core_styles from "@ordo-pink/frontend-app/index.css?inline"
import maoka_components from "@ordo-pink/maoka-components/maoka-components.css?inline"
import { noop } from "@ordo-pink/tau"
import { oath } from "@ordo-pink/oath"

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
		const cmd = state.commands
		const metadata_query = state.metadata_query

		cmd.on("cmd.file_editor.open", () => void cmd.emit("cmd.application.router.navigate", { url: "/editor" }))
		cmd.on("cmd.file_editor.open_file", x => void cmd.emit("cmd.application.router.navigate", { url: `/editor/${x}` }))

		cmd.emit("cmd.application.add_translations", {
			lang: TWO_LETTER_LOCALE.ENGLISH,
			translations: {
				"t.file_editor.command_palette.open": "Open File Editor",
				"t.file_editor.command_palette.open_file": "Open in File Editor...",
			},
		})

		cmd.emit("cmd.application.command_palette.add", {
			value: () => cmd.emit("cmd.file_editor.open"),
			readable_name: "t.file_editor.command_palette.open",
			type: CommandPaletteItemType.PAGE_OPENER,
			hotkey: "mod+e",
			render_icon: BsLayoutTextWindow,
		})

		cmd.on(
			"cmd.metadata.show_publish_modal",
			fsid => void cmd.emit("cmd.application.modal.show", { render: () => PublishMetadataModal(fsid) }),
		)

		cmd.on("cmd.metadata.unpublish", fsid => {
			metadata_query
				.get_by_fsid(fsid)
				.pipe(R.ops.chain(R.FromNullable))
				.pipe(
					R.ops.chain(metadata =>
						R.FromNullable(metadata.get_property("public_id"))
							.pipe(R.ops.chain(x => R.If(Metadata.Validations.is_fsid(x), { T: () => x as Ordo.Metadata.FSID })))
							.pipe(
								R.ops.chain(
									pub_fsid =>
										R.Try(() => void cmd.emit("cmd.metadata.remove", pub_fsid), noop)
											.pipe(R.ops.err_map(value => cmd.emit("cmd.metadata.set_property", { fsid, key: "public_id", value })))
											.pipe(R.ops.map(value => cmd.emit("cmd.metadata.set_property", { fsid, key: "public_id", value })))
											.pipe(R.ops.map(() => cmd.emit("cmd.content.remove", fsid))), // TODO
								),
							),
					),
				)
		})

		cmd.on("cmd.metadata.open_published_page", fsid => {
			const user = ordo_app_state.zags.select("user")
			const pb_host = ordo_app_state.zags.select("hosts.pb")

			user &&
				cmd.emit("cmd.application.router.open_external", {
					url: `${pb_host}/${user.get_handle()}/${fsid}`,
					new_tab: true,
				})
		})

		cmd.emit("cmd.application.context_menu.add", {
			command: "cmd.metadata.show_publish_modal",
			payload_creator: ({ payload }) => (payload as Ordo.Metadata.Instance).get_fsid(),
			readable_name: "Publish..." as any, // TODO i18n
			render_icon: BsCloudPlus,
			should_show: ({ payload }) => Metadata.Validations.is_metadata(payload) && !payload.get_property("public_id"),
			type: ContextMenuItemType.CREATE,
		})

		cmd.emit("cmd.application.context_menu.add", {
			command: "cmd.metadata.open_published_page",
			payload_creator: ({ payload }) => (payload as Ordo.Metadata.Instance).get_fsid(),
			readable_name: "Open published page" as any, // TODO i18n
			render_icon: BsBoxArrowUp,
			should_show: ({ payload }) => Metadata.Validations.is_metadata(payload) && !!payload.get_property("public_id"),
			type: ContextMenuItemType.READ,
		})

		cmd.emit("cmd.application.context_menu.add", {
			command: "cmd.metadata.unpublish",
			payload_creator: ({ payload }) => (payload as Ordo.Metadata.Instance).get_fsid(),
			readable_name: "Unpublish" as any, // TODO i18n
			render_icon: BsCloudMinus,
			should_show: ({ payload }) => Metadata.Validations.is_metadata(payload) && !!payload.get_property("public_id"),
			type: ContextMenuItemType.DELETE,
		})

		cmd.on("cmd.metadata.publish", fsid => {
			const content_query = state.content_query
			const metadata_query = state.metadata_query
			const metadata = metadata_query.get_by_fsid(fsid).cata(R.catas.or_else(() => null))
			const user = state.user_query.get_current().cata(R.catas.or_else(() => null))
			const fas = state.file_associations$.select("value")

			if (!metadata) throw rrr.codes.enoent("File nto found")
			if (!metadata.get_size()) throw rrr.codes.einval(`Cannot publish '${metadata.get_name()}' because it is empty`)
			if (!user) throw rrr.codes.eperm(`Cannot publish '${metadata.get_name()}' because user is not authenticated`)

			const name = `.${metadata.get_name()}-pub`
			const metadata_type = metadata.get_type()
			const fa = fas.find(fa => fa.types.some(type => type.name === metadata_type))

			// TODO Render file as is
			if (!fa) return

			return content_query
				.get(user.get_uid(), fsid)
				.pipe(oath.ops.and(oath.from_nullable))
				.pipe(oath.ops.fix(() => new ArrayBuffer(0)))
				.pipe(
					oath.ops.and(content =>
						oath
							.from_nullable(fa)

							// TODO Render file as is if there is no content_to_string
							.pipe(
								oath.ops.and(fa =>
									oath.from_nullable(fa.content_to_string).pipe(oath.ops.fix(() => ({ render: () => "", styles: [] }))),
								),
							)
							.pipe(
								oath.ops.and(({ render, styles }) =>
									oath
										.from_nullable(render)
										.pipe(oath.ops.fix(() => () => ""))
										.pipe(
											oath.ops.and(f =>
												oath.merge({ str: f({ metadata, content, is_editable: false, is_embedded: false }), styles }),
											),
										),
								),
							),
					),
				)
				.pipe(oath.ops.and(({ str, styles }) => create_publishable_page(metadata.get_name(), str, ...(styles ?? []))))
				.pipe(
					oath.ops.and(content =>
						cmd.naga("cmd.content.upload", {
							name,
							parent: fsid,
							content: new TextEncoder().encode(content).buffer,
							type: "text/html",
						}),
					),
				)
				.pipe(oath.ops.and(() => metadata_query.get_by_name(name, fsid, { show_hidden: true })))
				.pipe(oath.ops.and(r => r.cata({ Ok: m => oath.of(m), Err: () => oath.reject(null) })))
				.pipe(oath.ops.and(oath.from_nullable))
				.pipe(
					oath.ops.and(public_metadata =>
						cmd.naga("cmd.metadata.set_property", {
							fsid: metadata.get_fsid(),
							key: "public_id",
							value: public_metadata.get_fsid(),
						}),
					),
				)
				.cata(
					oath.catas.or_else(e => {
						throw rrr.codes.eperm(`Could not publish '${metadata.get_name()}'`, e)
					}),
				)
		})

		cmd.emit("cmd.application.command_palette.add", {
			value: () =>
				metadata_query.get().cata(
					R.catas.if_ok(metadata =>
						cmd.emit("cmd.application.command_palette.show", {
							items: metadata.map(metadata_to_command_palette_item(state)),
							max_items: 50,
							on_select: item => cmd.emit("cmd.file_editor.open_file", item.value),
						}),
					),
				),
			type: CommandPaletteItemType.PAGE_OPENER,
			readable_name: "t.file_editor.command_palette.open_file",
			hotkey: "mod+p",
			render_icon: BsLayoutTextWindow,
		})

		cmd.emit("cmd.functions.activities.register", {
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
			render_custom_info: () => FilePath(() => () => path),
			render_icon: () => MetadataIcon({ metadata }),
		}
	}

const FilePath = MaokaStyled.Tags.div("text-xs text-neutral-600 dark:text-neutral-400 w-fit whitespace-nowrap")

// TODO Move to utils
const get_path = (ancestors: Ordo.Metadata.Instance[]) =>
	sweech
		.of_true()
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
