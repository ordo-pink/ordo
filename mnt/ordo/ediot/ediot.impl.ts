import { bs_layout_text_window } from "@ordo-pink/frontend-icons"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"

import { ediot_workspace } from "./components/ediot-workspace.component"

export default ordo_client.f.create(
	"@ordo/ediot",
	{
		commands: [
			{ command: "@ordo/main.router.set_pathname" },
			{ command: "@ordo/main.activity.register" },
			{ command: "@ordo/main.activity.unregister" },
			{ command: "@ordo/main.i18n.add_translations" },
			{ command: "@ordo/main.i18n.remove_translations" },
			{ command: "@ordo/main.title.set_title" },
			{ command: "@ordo/main.data.show_create_modal" },
			{ command: "@ordo/main.data.show_delete_modal" },
			{ command: "@ordo/main.data.show_move_modal" },
			{ command: "@ordo/main.data.show_rename_modal" },
		],
		queries: [{ type: "i18n" }, { type: "data" }, { type: "router" }, { type: "activities", details: ["current"] }],
	},
	state => {
		const hunter = state.hunter

		const release_open = hunter.track("@ordo/ediot.open", () => void hunter.shoot("@ordo/main.router.set_pathname", "/ediot"))
		const release_open_file = hunter.track(
			"@ordo/ediot.open_file",
			({ id }) => void hunter.shoot("@ordo/main.router.set_pathname", `/ediot/${id}` as const),
		)

		hunter.shoot("@ordo/main.activity.register", {
			id: "@ordo/ediot.editor",
			readable_name: "ediot_title",
			routes: ["/ediot", "/ediot/:id", "/ediot/vaults/:vault_id", "/ediot/vaults/:vault_id/:id"],
			render_icon: span => maoka_dom.render(span, bs_layout_text_window(), ordo.uuid.create),
			render_workspace: div => maoka_dom.render(div, ediot_workspace({ state }), ordo.uuid.create),
		})

		hunter.shoot("@ordo/main.i18n.add_translations", { locale: "en", values: en_values })

		return () => {
			release_open()
			release_open_file()
			hunter.shoot("@ordo/main.activity.unregister", "@ordo/ediot.editor")
			hunter.shoot("@ordo/main.i18n.remove_translations", ordo.fns.keys_of(en_values))
		}
	},
)

const en_values = {
	ediot_title: "Ediot",
}
