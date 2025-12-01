import { bs_file_earmark_minus, bs_file_earmark_plus, bs_files, bs_input_cursor_text } from "@ordo-pink/frontend-icons"
import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"
import { maoka_styled } from "@ordo-pink/oss-maoka-styled"
import { sweech } from "@ordo-pink/oss-sweech"

import "./ediot-workspace.styles.css"

export const ediot_workspace = maoka.create<{ state: OrdoClient.F.InstanceState }>("div", ({ state, use }) => {
	use(ordo_client_maoka.context.provide(state))
	use(ordo_client_maoka.jabs.set_id("ediot-workspace"))

	const get_params = use(ordo_client_maoka.jabs.route_params$)

	return () => {
		ordo.logger.warn(get_params())
		const id = (get_params()?.id as any) ?? null
		if (!id) return "Empty" // TODO Empty Ediot
		if (!ordo.uuid.guard(id)) return "Invalid" // TODO Invalid ID

		return [header({ id }), render_picker({ id })]
	}
})

// --- Internal ---

// --- Rendering ---

const render_picker = maoka.create<{ id: Ordo.Data.Id }>("div", ({ id, node, refresh$, use }) => {
	let current_file_association: OrdoClient.FileAssociation.Instance

	const query = use(ordo_client_maoka.jabs.query)
	const get_data = use(ordo_client_maoka.jabs.data.get_by_id$(id))

	const handle_mount = () =>
		query.cheat("fa", fas => {
			const data = get_data()

			if (!data) return

			const content_type = ordo.data.get_content_type(data)

			for (const fa of fas) {
				if (fa.types.some(t => t.type === content_type)) {
					current_file_association = fa
					refresh$()
					break
				}
			}
		})

	use(maoka_dom.jabs.onmount(handle_mount))

	return async () => {
		const data = get_data()

		// TODO 404
		if (!data) return "Not Found"
		// TODO Unsupported file type
		if (!current_file_association) return "Unsupported"

		if (maoka_dom.node_guard(node))
			// TODO Check edit permissions
			await current_file_association.render({ data, div: node.value as HTMLDivElement, is_editable: true, is_embedded: false })
	}
})

// --- Header ---

const header = maoka.create<{ id: Ordo.Data.Id }>("div", ({ id, use }) => {
	const translate = use(ordo_client_maoka.jabs.translate$)
	const hunter = use(ordo_client_maoka.jabs.hunter)
	const query = use(ordo_client_maoka.jabs.query)
	const get_data_item = use(ordo_client_maoka.jabs.data.get_by_id$(id))
	const get_ancestors = use(ordo_client_maoka.jabs.data.get_ancestors$(id))

	const handle_onmount = () => {
		const data = get_data_item()
		const name = data ? ordo.data.get_name(data) : null
		const title = translate("ediot_title")

		hunter.shoot("@ordo/main.title.set_title", name ? `${name} | ${title}` : title)

		const release_data_delete = hunter.track("@ordo/main.data.delete", ({ id }) => {
			if (!data) return

			const current_data_id = ordo.data.get_id(data)

			if (current_data_id === id) {
				const parent = data ? ordo.data.get_parent(data) : null

				if (parent) hunter.shoot("@ordo/ediot.open_file", { id: parent })
				else hunter.shoot("@ordo/ediot.open")
			}
		})

		const divorce_data = query.cheat("data.root", data => {
			if (!data || !data[id]) {
				hunter.shoot("@ordo/main.command_palette.delete", "ediot_cp_create")
				hunter.shoot("@ordo/main.command_palette.delete", "ediot_cp_rename")
				hunter.shoot("@ordo/main.command_palette.delete", "ediot_cp_move")
				hunter.shoot("@ordo/main.command_palette.delete", "ediot_cp_delete")

				return
			}

			hunter.shoot("@ordo/main.command_palette.add", {
				id: "ediot_cp_create",
				readable_name: "ediot_cp_create_file_name",
				value: () => {
					hunter.shoot("@ordo/main.command_palette.hide")
					hunter.shoot("@ordo/main.data.show_create_modal", { parent: id })
				},
				description: "ediot_cp_create_file_description",
				hotkey: "meta+n",
				render_icon: span => maoka_dom.render(span, bs_file_earmark_plus(), ordo.uuid.create),
				type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.CONSTRUCTIVE_ACTION,
			})

			hunter.shoot("@ordo/main.command_palette.add", {
				id: "ediot_cp_rename",
				readable_name: "ediot_cp_rename_file_name",
				value: () => {
					hunter.shoot("@ordo/main.command_palette.hide")
					hunter.shoot("@ordo/main.data.show_rename_modal", { id })
				},
				description: "ediot_cp_rename_file_description",
				hotkey: "meta+shift+n",
				render_icon: span => maoka_dom.render(span, bs_input_cursor_text(), ordo.uuid.create),
				type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.CHANGE_ACTION,
			})

			hunter.shoot("@ordo/main.command_palette.add", {
				id: "ediot_cp_move",
				readable_name: "ediot_cp_move_file_name",
				value: () => {
					hunter.shoot("@ordo/main.command_palette.hide")
					hunter.shoot("@ordo/main.data.show_move_modal", { id })
				},
				description: "ediot_cp_move_file_description",
				hotkey: "mod+shift+m",
				render_icon: span => maoka_dom.render(span, bs_files(), ordo.uuid.create),
				type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.CHANGE_ACTION,
			})

			hunter.shoot("@ordo/main.command_palette.add", {
				id: "ediot_cp_delete",
				readable_name: "ediot_cp_delete_file_name",
				value: () => {
					hunter.shoot("@ordo/main.command_palette.hide")
					hunter.shoot("@ordo/main.data.show_delete_modal", { id })
				},
				description: "ediot_cp_delete_file_description",
				hotkey: "mod+shift+m",
				render_icon: span => maoka_dom.render(span, bs_file_earmark_minus(), ordo.uuid.create),
				type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.DESTRUCTIVE_ACTION,
			})
		})

		return () => {
			hunter.shoot("@ordo/main.command_palette.delete", "ediot_cp_create")
			hunter.shoot("@ordo/main.command_palette.delete", "ediot_cp_rename")
			hunter.shoot("@ordo/main.command_palette.delete", "ediot_cp_move")
			hunter.shoot("@ordo/main.command_palette.delete", "ediot_cp_delete")
			release_data_delete()
			divorce_data()
		}
	}

	const handle_actions_click = () => {
		hunter.shoot("@ordo/main.command_palette.show", {
			items: [
				{
					id: "create",
					readable_name: "ediot_create_file",
					value: ACTION_ITEM.CREATE,
					hotkey: "meta+n",
					render_icon: span => maoka_dom.render(span, bs_file_earmark_plus(), ordo.uuid.create),
					type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.CONSTRUCTIVE_ACTION,
				},
				{
					id: "delete",
					readable_name: "ediot_delete_file",
					value: ACTION_ITEM.DELETE,
					hotkey: "mod+shift+backspace",
					render_icon: span => maoka_dom.render(span, bs_file_earmark_minus(), ordo.uuid.create),
					type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.DESTRUCTIVE_ACTION,
				},
				{
					id: "rename",
					readable_name: "ediot_rename_file",
					value: ACTION_ITEM.RENAME,
					hotkey: "meta+shift+n",
					render_icon: span => maoka_dom.render(span, bs_input_cursor_text(), ordo.uuid.create),
					type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.CHANGE_ACTION,
				},
				{
					id: "move",
					readable_name: "ediot_move_file",
					value: ACTION_ITEM.MOVE,
					hotkey: "mod+shift+m",
					render_icon: span => maoka_dom.render(span, bs_files(), ordo.uuid.create),
					type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.CHANGE_ACTION,
				},
			],
			on_select: ({ value }) => {
				hunter.shoot("@ordo/main.command_palette.hide")

				sweech
					.match(value)
					.case(ACTION_ITEM.CREATE, () => void hunter.shoot("@ordo/main.data.show_create_modal", { parent: id }))
					.case(ACTION_ITEM.DELETE, () => void hunter.shoot("@ordo/main.data.show_delete_modal", { id }))
					.case(ACTION_ITEM.RENAME, () => void hunter.shoot("@ordo/main.data.show_rename_modal", { id }))
					.case(ACTION_ITEM.MOVE, () => void hunter.shoot("@ordo/main.data.show_move_modal", { id }))
					.default(ordo.fns.v)
			},
		})
	}

	use(ordo_client_maoka.jabs.set_class("header"))
	use(maoka_dom.jabs.onmount(handle_onmount))

	return () => {
		const data = get_data_item()
		const ancestors = get_ancestors()

		if (!data) {
			use(ordo_client_maoka.jabs.add_class("empty"))
			return null // TODO 404
		}

		use(ordo_client_maoka.jabs.remove_class("empty"))

		return [
			navigation(() => [...ancestors.map(item => ancestor_link({ item })), ancestor_link({ item: data, is_current: true })]),

			ordo_client_maoka.components.button.neutral({
				kindergarten: () => translate("ediot_actions"),
				on_click: handle_actions_click,
				hotkey: "mod+e",
			}),
		]
	}
})

const navigation = maoka_styled.div("navigation")
const ancestor_link = maoka.create<{ item: Ordo.Data.Instance | null; is_current?: boolean }>(
	"a",
	({ item, is_current, use }) => {
		const hunter = use(ordo_client_maoka.jabs.hunter)

		use(ordo_client_maoka.jabs.set_class("ancestor-link"))

		if (is_current) use(ordo_client_maoka.jabs.add_class("current"))
		if (item) {
			const id = ordo.data.get_id(item)
			const handle_click = ordo.fns
				.pipe(ordo_client.fns.prevent_default)
				.pipe(() => hunter.shoot("@ordo/ediot.open_file", { id }))

			use(ordo_client_maoka.jabs.set_attribute("href", `/ediot/${id}`))
			use(ordo_client_maoka.jabs.listen("click", handle_click))
		} else {
			const handle_click = ordo.fns.pipe(ordo_client.fns.prevent_default).pipe(() => hunter.shoot("@ordo/ediot.open"))

			use(ordo_client_maoka.jabs.set_attribute("href", "/ediot"))
			use(ordo_client_maoka.jabs.listen("click", handle_click))
		}

		return () => (item ? ordo.data.get_name(item) : "/")
	},
)

enum ACTION_ITEM {
	CREATE,
	RENAME,
	MOVE,
	DELETE,
}
