/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { bs_folder, bs_folder2_open } from "@ordo-pink/frontend-icons"
import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"

import { filet_workspace } from "./components/filet-workspace.component"

export default ordo_client.f.create(
	"@ordo/filet",
	{
		commands: [
			{ command: "@ordo/main.activity.add" },
			{ command: "@ordo/main.activity.delete" },
			{ command: "@ordo/main.command_palette.add" },
			{ command: "@ordo/main.command_palette.hide" },
			{ command: "@ordo/main.command_palette.delete" },
			{ command: "@ordo/main.command_palette.show" },
			{ command: "@ordo/main.data.show_create_modal" },
			{ command: "@ordo/main.data.show_delete_modal" },
			{ command: "@ordo/main.data.show_move_modal" },
			{ command: "@ordo/main.data.show_rename_modal" },
			{ command: "@ordo/main.data.delete" },
			{ command: "@ordo/main.i18n.add" },
			{ command: "@ordo/main.i18n.delete" },
			{ command: "@ordo/main.router.set_pathname" },
			{ command: "@ordo/main.title.set_title" },
		],
		queries: [{ type: "data" }, { type: "activities", details: ["current"] }, { type: "i18n" }],
	},
	state => {
		const { hunter } = state

		const release_open = hunter.track("@ordo/filet.open", () => void hunter.shoot("@ordo/main.router.set_pathname", "/filet"))
		const release_open_vault = hunter.track(
			"@ordo/filet.open_vault",
			id => void hunter.shoot("@ordo/main.router.set_pathname", `/filet/vaults/${id}` as const),
		)
		const release_open_file = hunter.track(
			"@ordo/filet.open_file",
			({ id, vault }) =>
				void hunter.shoot(
					"@ordo/main.router.set_pathname",
					vault ? (`/filet/vaults/${id}` as const) : (`/filet/${id}` as const),
				),
		)

		const icon = maoka.create<{ item: Ordo.Data.Instance }>("div", ({ item, use }) => {
			use(ordo_client_maoka.context.provide(state))

			return () => ordo_client_maoka.components.file_icon({ item })
		})

		hunter.shoot("@ordo/main.i18n.add", { locale: "en", values: en_values })

		hunter.shoot("@ordo/main.activity.add", {
			id: "@ordo/filet.explorer",
			readable_name: "filet_title",
			routes: ["/filet", "/filet/:id", "/filet/vaults/:vault", "/filet/vaults/:vault/:id"],
			render_icon: div => maoka_dom.render(div, bs_folder2_open(), ordo.uuid.create),
			render_workspace: div => maoka_dom.render(div, filet_workspace({ state }), ordo.uuid.create),
		})

		hunter.shoot("@ordo/main.command_palette.add", {
			readable_name: "filet_cp_open_name",
			value: () => {
				hunter.shoot("@ordo/filet.open")
				hunter.shoot("@ordo/main.command_palette.hide")
			},
			id: "filet_open",
			render_icon: div => maoka_dom.render(div, bs_folder2_open(), ordo.uuid.create),
			description: "filet_cp_open_description",
			hotkey: "mod+shift+f",
			type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.PAGE_OPENER,
		})

		hunter.shoot("@ordo/main.command_palette.add", {
			readable_name: "filet_cp_open_as_directory_name",
			value: () => {
				const data = state.query.select("data.root")

				hunter.shoot("@ordo/main.command_palette.show", {
					items: Object.values(data).map(item => {
						const id = ordo.data.get_id(item)
						const readable_name = ordo.data.get_name(item)
						const ancestors = ordo.data.get_ancestors(id, data)
						const ances_tree = ancestors.map(ordo.data.get_name).join("/")

						return {
							id,
							readable_name,
							value: id,
							description: ances_tree === "" ? `/${readable_name}` : `/${ances_tree}/${readable_name}`,
							render_icon: span => maoka_dom.render(span, icon({ item }), ordo.uuid.create),
						}
					}),
					on_select: item => {
						hunter.shoot("@ordo/filet.open_file", { id: item.value })
						hunter.shoot("@ordo/main.command_palette.hide")
					},
				})
			},
			id: "filet_open_as_directory",
			render_icon: div => maoka_dom.render(div, bs_folder(), ordo.uuid.create),
			description: "filet_cp_open_as_directory_description",
			hotkey: "mod+o",
			type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.MODAL_OPENER,
		})

		return () => {
			release_open()
			release_open_file()
			release_open_vault()
			hunter.shoot("@ordo/main.activity.delete", "@ordo/filet.explorer")
			hunter.shoot("@ordo/main.command_palette.delete", "filet_open")
			hunter.shoot("@ordo/main.command_palette.delete", "filet_open_as_directory")
			hunter.shoot("@ordo/main.i18n.delete", ordo.fns.keys_of(en_values))
		}
	},
)

const en_values = {
	filet_title: "Filet",
	filet_create_file: "Create",
	filet_delete_file: "Delete",
	filet_rename_file: "Rename",
	filet_move_file: "Move",
	filet_cp_open_name: "Go to Filet",
	filet_cp_open_description: "Filet provides common file explorer/file manager/finder experience for your Ordo files.",
	filet_cp_open_vault_name: "Open Vault...",
	filet_cp_open_vault_description: "Switch between different vaults without the need to look for them in the file tree.",
	filet_cp_open_as_directory_name: "Open as Directory...",
	filet_cp_open_as_directory_description:
		"Filet allows you to look inside a file as a directory. Yes, confusingly enough, Ordo files are also directories.",
	filet_cp_create_file_name: "Create file...",
	filet_cp_create_file_description: "Create a file in the current directory.",
	filet_cp_delete_file_name: "Delete file...",
	filet_cp_delete_file_description: "Delete currently opened file.",
	filet_cp_rename_file_name: "Rename file...",
	filet_cp_rename_file_description: "Rename currently opened file.",
	filet_cp_move_file_name: "Move file...",
	filet_cp_move_file_description: "Move currently opened file to a different directory.",
}
