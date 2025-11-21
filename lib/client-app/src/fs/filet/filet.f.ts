import { bs_folder_open } from "@ordo-pink/frontend-icons"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"

import { filet_workspace } from "./components/filet-workspace.component"

export default ordo_client.f.create(
	"@ordo-pink/file-explorer",
	{
		commands: [
			{ command: "activity.register" },
			{ command: "activity.unregister" },
			{ command: "title.set_title" },
			{ command: "i18n.add_translations" },
			{ command: "i18n.remove_translations" },
			{ command: "command_palette.add" },
			{ command: "command_palette.remove" },
			{ command: "router.set_pathname" },
		],
		queries: [{ type: "data" }],
	},
	state => {
		const { hunter } = state

		hunter.shoot("activity.register", {
			id: FILET_ACTIVITY_ID,
			readable_name: "file_explorer_title",
			routes: ["/files", "/files/:id", "/files/:vault/:id"],
			render_icon: div => maoka_dom.render(div, bs_folder_open(), ordo.uuid.create),
			render_workspace: div => maoka_dom.render(div, filet_workspace({ state }), ordo.uuid.create),
		})

		hunter.shoot("i18n.add_translations", { locale: "en", values: en })

		hunter.shoot("command_palette.add", {
			readable_name: "filet_cp_open_name",
			value: () => hunter.shoot("router.set_pathname", "/files"),
			id: FILET_COMMAND_PALETTE_OPEN,
			render_icon: div => maoka_dom.render(div, bs_folder_open(), ordo.uuid.create),
			description: "filet_cp_open_description",
			hotkey: "mod+shift+f",
		})

		return () => {
			hunter.shoot("activity.unregister", FILET_ACTIVITY_ID)
			hunter.shoot("command_palette.remove", FILET_COMMAND_PALETTE_OPEN)
			hunter.shoot("i18n.remove_translations", ordo.fns.keys_of(en))
		}
	},
)

const FILET_ACTIVITY_ID = "@ordo-pink/file-explorer"
const FILET_COMMAND_PALETTE_OPEN = "@ordo-pink/file-explorer/command-palette/open"

const en = {
	file_explorer_title: "Filet",
	filet_cp_open_name: "Go to Filet",
	filet_cp_open_description: "Filet provides common file explorer/file manager/finder experience for your Ordo files.",
}
