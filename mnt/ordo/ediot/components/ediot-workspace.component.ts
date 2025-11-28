import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"
import { maoka_styled } from "@ordo-pink/oss-maoka-styled"

import "./ediot-workspace.styles.css"

export const ediot_workspace = maoka.create<{ state: OrdoClient.F.InstanceState }>("div", ({ state, use }) => {
	use(ordo_client_maoka.context.provide(state))
	use(ordo_client_maoka.jabs.set_id("ediot-workspace"))

	const get_params = use(ordo_client_maoka.jabs.route_params$)

	return () => {
		const id = get_params()?.id ?? null
		if (!ordo.data.parent_guard(id)) return null // TODO 404

		// TODO Empty editor
		return [header({ id })]
	}
})

// --- Internal ---

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

const action_buttons = maoka_styled.div("action-buttons")
const navigation = maoka_styled.div("navigation")

const header = maoka.create<{ id: Ordo.Data.Parent }>("div", ({ id, use }) => {
	const translate = use(ordo_client_maoka.jabs.translate$)
	const hunter = use(ordo_client_maoka.jabs.hunter)
	const get_data = use(ordo_client_maoka.jabs.data.get_by_id$(id))
	const get_ancestors = use(ordo_client_maoka.jabs.data.get_ancestors$(id))

	const handle_onmount = () => {
		const data = get_data()
		const name = data ? ordo.data.get_name(data) : null
		const title = translate("ediot_title")

		hunter.shoot("@ordo/main.title.set_title", name ? `${name} | ${title}` : title)
	}

	use(ordo_client_maoka.jabs.add_class("header"))
	use(maoka_dom.jabs.onmount(handle_onmount))

	return () => {
		const data = get_data()

		const ancestors = get_ancestors()
		const parent = data ? ordo.data.get_parent(data) : null

		return [
			navigation(() => [
				ancestor_link({ item: null, is_current: !id }),
				...ancestors.map(item => ancestor_link({ item })),
				data && ancestor_link({ item: data, is_current: true }),
			]),

			action_buttons(() => [
				id &&
					ordo_client_maoka.components.button.neutral({
						kindergarten: () => translate("ediot_delete_file"),
						on_click: () =>
							void hunter.shoot("@ordo/main.data.show_delete_modal", {
								id,
								on_deleted: () =>
									parent ? hunter.shoot("@ordo/ediot.open_file", { id: parent }) : hunter.shoot("@ordo/ediot.open"),
							}),
						hotkey: "mod+shift+backspace",
						small: true,
					}),
				id &&
					ordo_client_maoka.components.button.neutral({
						kindergarten: () => translate("ediot_rename_file"),
						on_click: () => void hunter.shoot("@ordo/main.data.show_rename_modal", { id }),
						hotkey: "meta+shift+n",
						small: true,
					}),
				id &&
					ordo_client_maoka.components.button.neutral({
						kindergarten: () => translate("ediot_move_file"),
						on_click: () => void hunter.shoot("@ordo/main.data.show_move_modal", { id }),
						hotkey: "mod+shift+m",
						small: true,
					}),
				ordo_client_maoka.components.button.neutral({
					kindergarten: () => translate("ediot_create_file"),
					on_click: () => void hunter.shoot("@ordo/main.data.show_create_modal", { parent: id }),
					hotkey: "meta+n",
					small: true,
				}),
			]),
		]
	}
})
