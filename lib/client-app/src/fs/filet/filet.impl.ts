/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { bs_folder_open } from "@ordo-pink/frontend-icons"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"

import * as FILET from "./filet.constants"
import { filet_workspace } from "./components/filet-workspace.component"

export default ordo_client.f.create(
	FILET.NAME,
	{
		commands: [
			{ command: "activity.register" },
			{ command: "activity.unregister" },
			{ command: "command_palette.add" },
			{ command: "command_palette.remove" },
			{ command: "data.show_create_modal" },
			{ command: "data.show_delete_modal" },
			{ command: "i18n.add_translations" },
			{ command: "i18n.remove_translations" },
			{ command: "router.set_pathname" },
			{ command: "title.set_title" },
		],
		queries: [{ type: "data" }, { type: "activities", details: ["current"] }, { type: "i18n" }],
	},
	state => {
		const { hunter } = state

		const release_open = hunter.track("ordo.filet.open", () => void hunter.shoot("router.set_pathname", "/filet"))
		const release_open_vault = hunter.track(
			"ordo.filet.open_vault",
			id => void hunter.shoot("router.set_pathname", `/filet/vaults/${id}` as const),
		)
		const release_open_file = hunter.track(
			"ordo.filet.open_file",
			({ id, vault }) =>
				void hunter.shoot("router.set_pathname", vault ? (`/filet/vaults/${id}` as const) : (`/filet/${id}` as const)),
		)

		hunter.shoot("i18n.add_translations", { locale: "en", values: en_values })

		hunter.shoot("activity.register", {
			id: FILET.NAME,
			readable_name: "filet_title",
			routes: ["/filet", "/filet/:id", "/filet/vaults/:vault", "/filet/vaults/:vault/:id"],
			render_icon: div => maoka_dom.render(div, bs_folder_open(), ordo.uuid.create),
			render_workspace: div => maoka_dom.render(div, filet_workspace({ state }), ordo.uuid.create),
		})

		hunter.shoot("command_palette.add", {
			readable_name: "filet_cp_open_name",
			value: () => hunter.shoot("ordo.filet.open"),
			id: FILET.CP_OPEN_ID,
			render_icon: div => maoka_dom.render(div, bs_folder_open(), ordo.uuid.create),
			description: "filet_cp_open_description",
			hotkey: "mod+shift+f",
			type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.PAGE_OPENER,
		})

		// hunter.shoot("command_palette.add", {
		// 	readable_name: "filet_cp_open_as_directory_name",
		// 	value: ordo.todo,
		// 	id: FILET.CP_OPEN_AS_DIRECTORY_ID,
		// 	render_icon: div => maoka_dom.render(div, bs_files(), ordo.uuid.create),
		// 	description: "filet_cp_open_as_directory_description",
		// 	hotkey: "mod+o",
		// 	type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.MODAL_OPENER,
		// })

		// hunter.shoot("command_palette.add", {
		// 	readable_name: "filet_cp_open_vault_name",
		// 	value: ordo.todo,
		// 	id: FILET.CP_OPEN_VAULT_ID,
		// 	render_icon: div => maoka_dom.render(div, bs_safe_2(), ordo.uuid.create),
		// 	description: "filet_cp_open_vault_description",
		// 	hotkey: "meta+v",
		// 	type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.MODAL_OPENER,
		// })

		return () => {
			release_open()
			release_open_file()
			release_open_vault()
			hunter.shoot("activity.unregister", FILET.NAME)
			hunter.shoot("command_palette.remove", FILET.CP_OPEN_ID)
			// hunter.shoot("command_palette.remove", FILET.CP_OPEN_AS_DIRECTORY_ID)
			// hunter.shoot("command_palette.remove", FILET.CP_OPEN_VAULT_ID)
			hunter.shoot("i18n.remove_translations", ordo.fns.keys_of(en_values))
		}
	},
)

const en_values = {
	filet_title: "Filet",
	filet_create_file: "Create",
	filet_delete_file: "Delete",
	filet_cp_open_name: "Go to Filet",
	filet_cp_open_description: "Filet provides common file explorer/file manager/finder experience for your Ordo files.",
	filet_cp_open_vault_name: "Open Vault...",
	filet_cp_open_vault_description: "Switch between different vaults without the need to look for them in the file tree.",
	filet_cp_open_as_directory_name: "Open as Directory...",
	filet_cp_open_as_directory_description:
		"Filet allows you to look inside a file as a directory. Yes, confusingly enough, Ordo files are also directories.",
}
