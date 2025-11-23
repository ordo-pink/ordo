import { bs_file_earmark, bs_folder_open, bs_plus } from "@ordo-pink/frontend-icons"
import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_styled } from "@ordo-pink/oss-maoka-styled"

import "./filet-workspace.styles.css"

type Args = { state: OrdoClient.F.State }
export const filet_workspace = maoka.create<Args>("div", ({ state, use }) => {
	use(ordo_client_maoka.context.provide(state))
	use(ordo_client_maoka.jabs.set_id("filet-workspace"))
	const get_params = use(ordo_client_maoka.jabs.route_params$)

	// TODO Renaming
	// TODO Moving
	// TODO Labels
	// TODO Links
	// TODO Access
	// TODO Fields
	return () => {
		const id = get_params()?.id ?? null
		if (!ordo.data.parent_guard(id)) return null // TODO 404

		return [header({ id }), grid({ id }), create_button({ id })]
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
				.pipe(() => hunter.shoot("ordo.filet.open_file", { id }))

			use(ordo_client_maoka.jabs.set_attribute("href", `/filet/${id}`)) // TODO Vaults
			use(ordo_client_maoka.jabs.listen("onclick", handle_click))
		} else {
			const handle_click = ordo.fns.pipe(ordo_client.fns.prevent_default).pipe(() => hunter.shoot("ordo.filet.open"))

			use(ordo_client_maoka.jabs.set_attribute("href", "/filet"))
			use(ordo_client_maoka.jabs.listen("onclick", handle_click))
		}

		return () => (item ? ordo.data.get_name(item) : "/")
	},
)

const header = maoka.create<{ id: Ordo.Data.Parent }>("div", ({ id, use }) => {
	use(ordo_client_maoka.jabs.add_class("header"))

	const get_data = use(ordo_client_maoka.jabs.data.get_by_id$(id))
	const get_ancestors = use(ordo_client_maoka.jabs.data.get_ancestors$(id))

	return () => {
		const data = get_data()
		const ancestors = get_ancestors()

		return [
			ancestor_link({ item: null }),
			...ancestors.map(item => ancestor_link({ item })),
			data && ancestor_link({ item: data, is_current: true }),
		]
	}
})

type FileIconArgs = { item: Ordo.Data.Instance }
const file_icon = maoka.create<FileIconArgs>("div", ({ item, use }) => {
	const id = ordo.data.get_id(item)

	const get_children = use(ordo_client_maoka.jabs.data.get_children$(id))

	return () => {
		const children = get_children()

		// TODO Show as folder only if it is an ordo file with children
		if (children.some(ordo.data.has_parent(id))) return bs_folder_open()
		// TODO File association icon
		else return bs_file_earmark()
	}
})

type GridItemArgs = { item: Ordo.Data.Instance }
const grid_item = maoka.create<GridItemArgs>("div", ({ item, use }) => {
	const hunter = use(ordo_client_maoka.jabs.hunter)

	const id = ordo.data.get_id(item)
	const handle_click = () => hunter.shoot("ordo.filet.open_file", { id })

	use(ordo_client_maoka.jabs.add_class("item"))
	use(ordo_client_maoka.jabs.listen("onclick", handle_click))

	return () => [file_icon({ item }), filename(() => ordo.data.get_name(item))]
})

const filename = maoka_styled.div("filename")

type GridArgs = { id: Ordo.Data.Parent }
const grid = maoka.create<GridArgs>("div", ({ id, use }) => {
	const get_data = use(ordo_client_maoka.jabs.data.get_children$(id))

	use(ordo_client_maoka.jabs.add_class("data-grid"))

	return () => {
		const data = get_data()

		return Object.values(data).map(item => grid_item({ item }))
	}
})

type CreateButtonArgs = { id: Ordo.Data.Parent }
const create_button = maoka.create<CreateButtonArgs>("button", ({ id, use }) => {
	const { hunter } = use(ordo_client_maoka.context.consume)

	const handle_click = () => hunter.shoot("data.show_create_modal", { parent: id })

	use(ordo_client_maoka.jabs.set_class("create-button"))
	use(ordo_client_maoka.jabs.listen("onclick", handle_click))

	return () => bs_plus()
})
