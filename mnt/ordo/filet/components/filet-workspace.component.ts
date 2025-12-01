/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { bs_file_earmark_minus, bs_file_earmark_plus, bs_files, bs_input_cursor_text } from "@ordo-pink/frontend-icons"
import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"
import { maoka_styled } from "@ordo-pink/oss-maoka-styled"
import { sweech } from "@ordo-pink/oss-sweech"

import "./filet-workspace.styles.css"

export const filet_workspace = maoka.create<{ state: OrdoClient.F.InstanceState }>("div", ({ state, use }) => {
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

// --- Header ---

const header = maoka.create<{ id: Ordo.Data.Parent }>("div", ({ id, use }) => {
	const translate = use(ordo_client_maoka.jabs.translate$)
	const hunter = use(ordo_client_maoka.jabs.hunter)
	const query = use(ordo_client_maoka.jabs.query)
	const get_data = use(ordo_client_maoka.jabs.data.get_by_id$(id))
	const get_ancestors = use(ordo_client_maoka.jabs.data.get_ancestors$(id))

	const handle_onmount = () => {
		const data = get_data()
		const name = data ? ordo.data.get_name(data) : null
		const title = translate("filet_title")

		hunter.shoot("@ordo/main.title.set_title", name ? `${name} | ${title}` : title)

		const release_data_delete = hunter.track("@ordo/main.data.delete", ({ id }) => {
			if (!data) return

			const current_data_id = ordo.data.get_id(data)

			if (current_data_id === id) {
				const parent = data ? ordo.data.get_parent(data) : null

				if (parent) hunter.shoot("@ordo/filet.open_file", { id: parent })
				else hunter.shoot("@ordo/filet.open")
			}
		})

		const divorce_data = query.cheat("data.root", data => {
			hunter.shoot("@ordo/main.command_palette.add", {
				id: "filet_cp_create",
				readable_name: "filet_cp_create_file_name",
				value: () => {
					hunter.shoot("@ordo/main.command_palette.hide")
					hunter.shoot("@ordo/main.data.show_create_modal", { parent: id })
				},
				description: "filet_cp_create_file_description",
				hotkey: "meta+n",
				render_icon: span => maoka_dom.render(span, bs_file_earmark_plus(), ordo.uuid.create),
				type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.CONSTRUCTIVE_ACTION,
			})

			if (!id || !data || !data[id]) {
				hunter.shoot("@ordo/main.command_palette.delete", "filet_cp_rename")
				hunter.shoot("@ordo/main.command_palette.delete", "filet_cp_move")
				hunter.shoot("@ordo/main.command_palette.delete", "filet_cp_delete")

				return
			}

			hunter.shoot("@ordo/main.command_palette.add", {
				id: "filet_cp_rename",
				readable_name: "filet_cp_rename_file_name",
				value: () => {
					hunter.shoot("@ordo/main.command_palette.hide")
					hunter.shoot("@ordo/main.data.show_rename_modal", { id })
				},
				description: "filet_cp_rename_file_description",
				hotkey: "meta+shift+n",
				render_icon: span => maoka_dom.render(span, bs_input_cursor_text(), ordo.uuid.create),
				type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.CHANGE_ACTION,
			})

			hunter.shoot("@ordo/main.command_palette.add", {
				id: "filet_cp_move",
				readable_name: "filet_cp_move_file_name",
				value: () => {
					hunter.shoot("@ordo/main.command_palette.hide")
					hunter.shoot("@ordo/main.data.show_move_modal", { id })
				},
				description: "filet_cp_move_file_description",
				hotkey: "mod+shift+m",
				render_icon: span => maoka_dom.render(span, bs_files(), ordo.uuid.create),
				type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.CHANGE_ACTION,
			})

			hunter.shoot("@ordo/main.command_palette.add", {
				id: "filet_cp_delete",
				readable_name: "filet_cp_delete_file_name",
				value: () => {
					hunter.shoot("@ordo/main.command_palette.hide")
					hunter.shoot("@ordo/main.data.show_delete_modal", { id })
				},
				description: "filet_cp_delete_file_description",
				hotkey: "mod+shift+m",
				render_icon: span => maoka_dom.render(span, bs_file_earmark_minus(), ordo.uuid.create),
				type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.DESTRUCTIVE_ACTION,
			})
		})

		return () => {
			hunter.shoot("@ordo/main.command_palette.delete", "filet_cp_create")
			hunter.shoot("@ordo/main.command_palette.delete", "filet_cp_rename")
			hunter.shoot("@ordo/main.command_palette.delete", "filet_cp_move")
			hunter.shoot("@ordo/main.command_palette.delete", "filet_cp_delete")
			release_data_delete()
			divorce_data()
		}
	}

	const handle_actions_click = () => {
		hunter.shoot("@ordo/main.command_palette.show", {
			items: [
				{
					id: "create",
					readable_name: "filet_create_file",
					value: ACTION_ITEM.CREATE,
					hotkey: "meta+n",
					render_icon: span => maoka_dom.render(span, bs_file_earmark_plus(), ordo.uuid.create),
					type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.CONSTRUCTIVE_ACTION,
				} as OrdoClient.CommandPalette.Item,
			].concat(
				id
					? [
							{
								id: "delete",
								readable_name: "filet_delete_file",
								value: ACTION_ITEM.DELETE,
								hotkey: "mod+shift+backspace",
								render_icon: span => maoka_dom.render(span, bs_file_earmark_minus(), ordo.uuid.create),
								type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.DESTRUCTIVE_ACTION,
							},
							{
								id: "rename",
								readable_name: "filet_rename_file",
								value: ACTION_ITEM.RENAME,
								hotkey: "meta+shift+n",
								render_icon: span => maoka_dom.render(span, bs_input_cursor_text(), ordo.uuid.create),
								type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.CHANGE_ACTION,
							},
							{
								id: "move",
								readable_name: "filet_move_file",
								value: ACTION_ITEM.MOVE,
								hotkey: "mod+shift+m",
								render_icon: span => maoka_dom.render(span, bs_files(), ordo.uuid.create),
								type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.CHANGE_ACTION,
							},
						]
					: [],
			),
			on_select: ({ value }) => {
				hunter.shoot("@ordo/main.command_palette.hide")

				sweech
					.match(value)
					.case(ACTION_ITEM.CREATE, () => void hunter.shoot("@ordo/main.data.show_create_modal", { parent: id }))
					.case(ACTION_ITEM.DELETE, () => void hunter.shoot("@ordo/main.data.show_delete_modal", { id: id! }))
					.case(ACTION_ITEM.RENAME, () => void hunter.shoot("@ordo/main.data.show_rename_modal", { id: id! }))
					.case(ACTION_ITEM.MOVE, () => void hunter.shoot("@ordo/main.data.show_move_modal", { id: id! }))
					.default(ordo.fns.v)
			},
		})
	}

	use(ordo_client_maoka.jabs.add_class("header"))
	use(maoka_dom.jabs.onmount(handle_onmount))

	return () => {
		const data = get_data()
		const ancestors = get_ancestors()

		return [
			navigation(() => [
				ancestor_link({ item: null, is_current: !id }),
				...ancestors.map(item => ancestor_link({ item })),
				data && ancestor_link({ item: data, is_current: true }),
			]),

			ordo_client_maoka.components.button.neutral({
				kindergarten: () => translate("filet_actions"),
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
				.pipe(() => hunter.shoot("@ordo/filet.open_file", { id }))

			use(ordo_client_maoka.jabs.set_attribute("href", `/filet/${id}`))
			use(ordo_client_maoka.jabs.listen("click", handle_click))
		} else {
			const handle_click = ordo.fns.pipe(ordo_client.fns.prevent_default).pipe(() => hunter.shoot("@ordo/filet.open"))

			use(ordo_client_maoka.jabs.set_attribute("href", "/filet"))
			use(ordo_client_maoka.jabs.listen("click", handle_click))
		}

		return () => (item ? ordo.data.get_name(item) : "/")
	},
)

// --- Grid ---

type GridArgs = { id: Ordo.Data.Parent }
const grid = maoka.create<GridArgs>("div", ({ id, use }) => {
	const get_data = use(ordo_client_maoka.jabs.data.get_children$(id))

	use(ordo_client_maoka.jabs.add_class("data-grid"))

	return () => {
		const data = get_data()

		return Object.values(data).map(item => grid_item({ item }))
	}
})

type GridItemArgs = { item: Ordo.Data.Instance }
const grid_item = maoka.create<GridItemArgs>("div", ({ item, use }) => {
	const hunter = use(ordo_client_maoka.jabs.hunter)

	const id = ordo.data.get_id(item)
	const handle_click = () => hunter.shoot("@ordo/filet.open_file", { id })

	use(ordo_client_maoka.jabs.add_class("item"))
	use(ordo_client_maoka.jabs.listen("click", handle_click))

	return () => [ordo_client_maoka.components.file_icon({ item }), filename(() => ordo.data.get_name(item))]
})

const filename = maoka_styled.div("filename")

enum ACTION_ITEM {
	CREATE,
	RENAME,
	MOVE,
	DELETE,
}
