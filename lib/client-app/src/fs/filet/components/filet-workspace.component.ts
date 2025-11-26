/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_styled } from "@ordo-pink/oss-maoka-styled"

import "./filet-workspace.styles.css"

export const filet_workspace = maoka.create<{ state: OrdoClient.F.State }>("div", ({ state, use }) => {
	use(ordo_client_maoka.context.provide(state))
	use(ordo_client_maoka.jabs.set_id("filet-workspace"))
	const get_params = use(ordo_client_maoka.jabs.route_params$)

	return () => {
		const id = get_params()?.id ?? null
		if (!ordo.data.parent_guard(id)) return null // TODO 404

		return [header({ id }), grid({ id })]
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
				.pipe(() => hunter.shoot("ordo_filet.open_file", { id }))

			use(ordo_client_maoka.jabs.set_attribute("href", `/filet/${id}`))
			use(ordo_client_maoka.jabs.listen("click", handle_click))
		} else {
			const handle_click = ordo.fns.pipe(ordo_client.fns.prevent_default).pipe(() => hunter.shoot("ordo_filet.open"))

			use(ordo_client_maoka.jabs.set_attribute("href", "/filet"))
			use(ordo_client_maoka.jabs.listen("click", handle_click))
		}

		return () => (item ? ordo.data.get_name(item) : "/")
	},
)

const action_buttons = maoka_styled.div("action-buttons")
const navigation = maoka_styled.div("navigation")

const header = maoka.create<{ id: Ordo.Data.Parent }>("div", ({ id, use }) => {
	use(ordo_client_maoka.jabs.add_class("header"))

	const translate = use(ordo_client_maoka.jabs.translate$)
	const hunter = use(ordo_client_maoka.jabs.hunter)
	const get_data = use(ordo_client_maoka.jabs.data.get_by_id$(id))
	const get_ancestors = use(ordo_client_maoka.jabs.data.get_ancestors$(id))
	const get_params = use(ordo_client_maoka.jabs.route_params$)

	return () => {
		const data = get_data()
		const ancestors = get_ancestors()
		const parent = data ? ordo.data.get_parent(data) : null

		return [
			navigation(() => [
				ancestor_link({ item: null, is_current: !get_params()?.id }),
				...ancestors.map(item => ancestor_link({ item })),
				data && ancestor_link({ item: data, is_current: true }),
			]),

			action_buttons(() => [
				id &&
					ordo_client_maoka.components.button.neutral({
						kindergarten: () => translate("filet_delete_file"),
						on_click: () =>
							void hunter.shoot("ordo_main.data.show_delete_modal", {
								id,
								on_deleted: () =>
									parent ? hunter.shoot("ordo_filet.open_file", { id: parent }) : hunter.shoot("ordo_filet.open"),
							}),
						hotkey: "mod+shift+backspace",
						small: true,
					}),
				id &&
					ordo_client_maoka.components.button.neutral({
						kindergarten: () => translate("filet_rename_file"),
						on_click: () => void hunter.shoot("ordo_main.data.show_rename_modal", { id }),
						hotkey: "meta+shift+n",
						small: true,
					}),
				id &&
					ordo_client_maoka.components.button.neutral({
						kindergarten: () => translate("filet_move_file"),
						on_click: () => void hunter.shoot("ordo_main.data.show_move_modal", { id }),
						hotkey: "mod+shift+m",
						small: true,
					}),
				ordo_client_maoka.components.button.neutral({
					kindergarten: () => translate("filet_create_file"),
					on_click: () => void hunter.shoot("ordo_main.data.show_create_modal", { parent: id }),
					hotkey: "meta+n",
					small: true,
				}),
			]),
		]
	}
})

type GridItemArgs = { item: Ordo.Data.Instance }
const grid_item = maoka.create<GridItemArgs>("div", ({ item, use }) => {
	const hunter = use(ordo_client_maoka.jabs.hunter)

	const id = ordo.data.get_id(item)
	const handle_click = () => hunter.shoot("ordo_filet.open_file", { id })

	use(ordo_client_maoka.jabs.add_class("item"))
	use(ordo_client_maoka.jabs.listen("click", handle_click))

	return () => [ordo_client_maoka.components.file_icon({ item }), filename(() => ordo.data.get_name(item))]
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
