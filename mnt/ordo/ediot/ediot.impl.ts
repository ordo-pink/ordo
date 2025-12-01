import { bs_file_earmark, bs_file_earmark_rich_text, bs_layout_text_window } from "@ordo-pink/frontend-icons"
import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"

import { ediot_workspace } from "./components/ediot-workspace.component"
import { text_ordo } from "./components/text-ordo.component"

export default ordo_client.f.create(
	"@ordo/ediot",
	{
		commands: [
			{ command: "@ordo/main.activity.add" },
			{ command: "@ordo/main.activity.delete" },
			{ command: "@ordo/main.command_palette.add" },
			{ command: "@ordo/main.command_palette.delete" },
			{ command: "@ordo/main.command_palette.hide" },
			{ command: "@ordo/main.command_palette.show" },
			{ command: "@ordo/main.content.set" },
			{ command: "@ordo/main.data.delete" },
			{ command: "@ordo/main.data.show_create_modal" },
			{ command: "@ordo/main.data.show_delete_modal" },
			{ command: "@ordo/main.data.show_move_modal" },
			{ command: "@ordo/main.data.show_rename_modal" },
			{ command: "@ordo/main.file_association.add" },
			{ command: "@ordo/main.file_association.delete" },
			{ command: "@ordo/main.i18n.add" },
			{ command: "@ordo/main.i18n.delete" },
			{ command: "@ordo/main.router.set_pathname" },
			{ command: "@ordo/main.title.set_title" },
		],
		queries: [
			{ type: "activities", details: ["current"] },
			{ type: "data" },
			{ type: "file-associations" },
			{ type: "i18n" },
			{ type: "router" },
			{ type: "content", details: ["root"] },
		],
	},
	state => {
		const hunter = state.hunter

		const release_open = hunter.track("@ordo/ediot.open", () => void hunter.shoot("@ordo/main.router.set_pathname", "/ediot"))
		const release_open_file = hunter.track(
			"@ordo/ediot.open_file",
			({ id }) => void hunter.shoot("@ordo/main.router.set_pathname", `/ediot/${id}` as const),
		)

		const icon = maoka.create<{ item: Ordo.Data.Instance }>("div", ({ item, use }) => {
			use(ordo_client_maoka.context.provide(state))

			return () => ordo_client_maoka.components.file_icon({ item })
		})

		hunter.shoot("@ordo/main.activity.add", {
			id: "@ordo/ediot.editor",
			readable_name: "ediot_title",
			routes: ["/ediot", "/ediot/:id", "/ediot/vaults/:vault_id", "/ediot/vaults/:vault_id/:id"],
			render_icon: span => maoka_dom.render(span, bs_layout_text_window(), ordo.uuid.create),
			render_workspace: div => maoka_dom.render(div, ediot_workspace({ state }), ordo.uuid.create),
		})

		hunter.shoot("@ordo/main.file_association.add", {
			id: "@ordo/ediot.text_ordo",
			render: ({ content, data, div, is_editable, is_embedded }) =>
				maoka_dom.render(div, text_ordo({ content, data, is_editable, is_embedded, state }), ordo.uuid.create),
			types: [{ type: "text/ordo" }],
			render_file_icon: span => maoka_dom.render(span, bs_file_earmark_rich_text(), ordo.uuid.create),
		})

		hunter.shoot("@ordo/main.i18n.add", { locale: "en", values: en_values })

		hunter.shoot("@ordo/main.command_palette.add", {
			readable_name: "ediot_cp_open_name",
			value: () => {
				hunter.shoot("@ordo/ediot.open")
				hunter.shoot("@ordo/main.command_palette.hide")
			},
			id: "ediot_open",
			render_icon: div => maoka_dom.render(div, bs_layout_text_window(), ordo.uuid.create),
			description: "ediot_cp_open_description",
			hotkey: "mod+shift+f",
			type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.PAGE_OPENER,
		})

		hunter.shoot("@ordo/main.command_palette.add", {
			readable_name: "ediot_cp_open_file_name",
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
						hunter.shoot("@ordo/main.command_palette.hide")
						hunter.shoot("@ordo/ediot.open_file", { id: item.value })
					},
				})
			},
			id: "ediot_open_file",
			render_icon: div => maoka_dom.render(div, bs_file_earmark(), ordo.uuid.create),
			description: "ediot_cp_open_file_description",
			hotkey: "meta+p",
			type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.MODAL_OPENER,
		})

		return () => {
			release_open()
			release_open_file()
			hunter.shoot("@ordo/main.activity.delete", "@ordo/ediot.editor")
			hunter.shoot("@ordo/main.command_palette.delete", "ediot_open_file")
			hunter.shoot("@ordo/main.i18n.delete", ordo.fns.keys_of(en_values))
		}
	},
)

const en_values = {
	ediot_title: "Ediot",
	ediot_actions: "Actions",
	ediot_cp_open_name: "Go to Ediot",
	ediot_cp_open_description: "Ediot is a rich text editor for your Ordo files.",
	ediot_cp_open_file_name: "Open as file...",
	ediot_cp_open_file_description: "Choose a file to jump to.",
	ediot_cp_create_file_name: "Create file...",
	ediot_cp_create_file_description: "Create a file in the current directory.",
	ediot_cp_delete_file_name: "Delete file...",
	ediot_cp_delete_file_description: "Delete currently opened file.",
	ediot_cp_rename_file_name: "Rename file...",
	ediot_cp_rename_file_description: "Rename currently opened file.",
	ediot_cp_move_file_name: "Move file...",
	ediot_cp_move_file_description: "Move currently opened file to a different directory.",
	ediot_create_file: "Create a file in this directory",
	ediot_delete_file: "Delete current file",
	ediot_move_file: "Move current file to...",
	ediot_rename_file: "Rename current file",
}
