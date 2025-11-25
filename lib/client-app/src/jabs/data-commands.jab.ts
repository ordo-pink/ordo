/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Maoka, maoka } from "@ordo-pink/oss-maoka"
import type { Hunt } from "@ordo-pink/oss-hunt"
import type { Zags } from "@ordo-pink/oss-zags"
import { bs_slash } from "@ordo-pink/frontend-icons"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"

import { create_file_modal } from "../components/data-modals/create-file-modal/create-file-modal.component"
import { delete_file_modal } from "../components/data-modals/delete-file-modal/delete-file-modal.component"
import { rename_file_modal } from "../components/data-modals/rename-file-modal/rename-file-modal.component"

type Stream = Zags.Instance<OrdoClient.Data.State>
type Repo = OrdoClient.Data.Repository
type Gun<$Prey extends keyof Hunt.ToPreys<OrdoClient.Command.Preys>> = OrdoClient.Command.GunFor<$Prey>
type DataHandler<$Prey extends keyof Hunt.ToPreys<OrdoClient.Command.Preys>> = ($: Stream) => Gun<$Prey>
type ViewHandler<$Prey extends keyof Hunt.ToPreys<OrdoClient.Command.Preys>> = (state: OrdoClient.F.State) => Gun<$Prey>

export const data_commands =
	($: Stream, repo: Repo): Maoka.Jab =>
	({ use }) => {
		const state = use(ordo_client_maoka.context.consume)

		const handle_onmount = () =>
			$.cheat(
				"data.root",
				(data, is_update) =>
					is_update &&
					void repo.write(data).cata(oath.catas.or_else(rrr => state.hunter.shoot("ordo_main.notification.rrr", rrr))),
			)

		use(maoka_dom.jabs.onmount(handle_onmount))
		use(ordo_client_maoka.jabs.handle_command("ordo_main.data.create", handle_create($)))
		use(ordo_client_maoka.jabs.handle_command("ordo_main.data.delete", handle_delete($)))
		use(ordo_client_maoka.jabs.handle_command("ordo_main.data.fields.delete", handle_delete_field($)))
		use(ordo_client_maoka.jabs.handle_command("ordo_main.data.fields.set", handle_set_field($)))
		use(ordo_client_maoka.jabs.handle_command("ordo_main.data.labels.add", handle_add_label($)))
		use(ordo_client_maoka.jabs.handle_command("ordo_main.data.labels.delete", handle_delete_label($)))
		use(ordo_client_maoka.jabs.handle_command("ordo_main.data.links.add", handle_add_link($)))
		use(ordo_client_maoka.jabs.handle_command("ordo_main.data.links.delete", handle_delete_link($)))
		use(ordo_client_maoka.jabs.handle_command("ordo_main.data.move", handle_move($)))
		use(ordo_client_maoka.jabs.handle_command("ordo_main.data.rename", handle_rename($)))
		use(ordo_client_maoka.jabs.handle_command("ordo_main.data.set_group", handle_set_group($)))
		use(ordo_client_maoka.jabs.handle_command("ordo_main.data.set_location", handle_set_location($)))
		use(ordo_client_maoka.jabs.handle_command("ordo_main.data.set_owner", handle_set_owner($)))
		use(ordo_client_maoka.jabs.handle_command("ordo_main.data.set_permissions", handle_set_permissions($)))
		use(ordo_client_maoka.jabs.handle_command("ordo_main.data.show_create_modal", handle_show_create_modal(state)))
		use(ordo_client_maoka.jabs.handle_command("ordo_main.data.show_delete_modal", handle_show_delete_modal(state)))
		use(ordo_client_maoka.jabs.handle_command("ordo_main.data.show_rename_modal", handle_show_rename_modal(state)))
		use(ordo_client_maoka.jabs.handle_command("ordo_main.data.show_move_modal", handle_show_move_modal(state)))
	}

// --- Internal ---

const handle_show_create_modal: ViewHandler<"ordo_main.data.show_create_modal"> =
	state =>
	({ parent }) => {
		state.hunter.shoot("ordo_main.modal.show", {
			size: ORDO_CLIENT.MODAL.SIZE.SM,
			render: div => maoka_dom.render(div, create_file_modal({ state, parent }), ordo.uuid.create),
		})
	}

const handle_show_delete_modal: ViewHandler<"ordo_main.data.show_delete_modal"> =
	state =>
	({ id }) => {
		state.hunter.shoot("ordo_main.modal.show", {
			size: ORDO_CLIENT.MODAL.SIZE.SM,
			render: div => maoka_dom.render(div, delete_file_modal({ state, id }), ordo.uuid.create),
		})
	}

const handle_show_rename_modal: ViewHandler<"ordo_main.data.show_rename_modal"> =
	state =>
	({ id }) => {
		state.hunter.shoot("ordo_main.modal.show", {
			size: ORDO_CLIENT.MODAL.SIZE.SM,
			render: div => maoka_dom.render(div, rename_file_modal({ state, id }), ordo.uuid.create),
		})
	}

const handle_show_move_modal: ViewHandler<"ordo_main.data.show_move_modal"> =
	state =>
	({ id }) => {
		const data = state.query.select("data.root")
		const descs = ordo.data.get_descendents(id, data, []).map(ordo.data.get_id)
		const current_item = data[id]

		// TODO Check if current_item exists

		const items = Object.values(data)
			.filter(i => !!i && !ordo.data.has_id(id, i) && !descs.includes(ordo.data.get_id(i)))
			.map(item => {
				const id = ordo.data.get_id(item)
				const ancestors = ordo.data.get_ancestors(id, data)
				const ances_tree = ancestors.map(ordo.data.get_name).join("/")
				const name = ordo.data.get_name(item)

				return {
					id: ordo.data.get_id(item),
					value: ordo.data.get_id(item),
					readable_name: ordo.data.get_name(item),
					description: ances_tree === "" ? `/${name}` : `/${ances_tree}/${name}`,
					type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.CONSTRUCTIVE_ACTION,
					render_icon: span => maoka_dom.render(span, icon({ item }), ordo.uuid.create),
				} as OrdoClient.CommandPalette.Item
			})

		if (ordo.data.get_parent(current_item)) {
			items.unshift({
				id: "root",
				value: null,
				readable_name: "ordo_main_move_modal_move_to_root",
				render_icon: span => maoka_dom.render(span, bs_slash(), ordo.uuid.create),
			} as OrdoClient.CommandPalette.Item)
		}

		const icon = maoka.create<{ item: Ordo.Data.Instance }>("div", ({ item, use }) => {
			use(ordo_client_maoka.context.provide(state))

			return () => ordo_client_maoka.components.file_icon({ item })
		})

		state.hunter.shoot("ordo_main.command_palette.show", {
			on_select: ({ value }) => {
				state.hunter.shoot("ordo_main.data.move", { id, parent: value })
				state.hunter.shoot("ordo_main.command_palette.hide")
			},
			items,
		})
	}

// TODO Get proper author when auth is ready
// TODO Check permissions

const handle_create: DataHandler<"ordo_main.data.create"> = $ => params =>
	$.update("data.root", items => {
		const new_item = ordo.data.create(params, uid())
		const new_item_id = ordo.data.get_id(new_item)
		const new_item_name = ordo.data.get_name(new_item)
		const new_item_parent = ordo.data.get_parent(new_item)

		if (Object.values(items).some(i => ordo.data.get_name(i) === new_item_name && ordo.data.get_parent(i) === new_item_parent))
			throw ordo.rrr.eexist(ORDO.RRR.REASON.DATA_ALREADY_EXISTS, [new_item_name, new_item_parent, "data.create"])

		if (items[new_item_id]) throw ordo.rrr.eexist(ORDO.RRR.REASON.DATA_ALREADY_EXISTS, [new_item_id, "data.create"])

		return { ...items, [new_item_id]: new_item }
	})

const handle_delete: DataHandler<"ordo_main.data.delete"> =
	$ =>
	({ id }) =>
		$.update("data.root", items => {
			if (!items[id]) throw ordo.rrr.enoent(ORDO.RRR.REASON.DATA_NOT_FOUND, [id, "data.delete"])
			if (!check_permissions()) throw ordo.rrr.eperm(ORDO.RRR.REASON.DATA_DELETE_PERMISSION_DENIED, [id])

			const descendents = ordo.data.get_descendents(id, items, [])
			const new_items = descendents.reduce(
				(items, item) => {
					const id = ordo.data.get_id(item)
					delete items[id]

					return items
				},
				{ ...items },
			)
			delete new_items[id]

			return new_items
		})

const handle_delete_field: DataHandler<"ordo_main.data.fields.delete"> =
	$ =>
	({ id, key }) =>
		$.update("data.root", items => {
			if (!items[id]) throw ordo.rrr.enoent(ORDO.RRR.REASON.DATA_NOT_FOUND, [id, "data.fields.delete"])
			if (!check_permissions()) throw ordo.rrr.eperm(ORDO.RRR.REASON.DATA_UPDATE_PERMISSION_DENIED, [id])

			const fields = { ...ordo.data.get_fields(items[id]), [key]: undefined }
			const new_item = ordo.data.update({ fields }, uid(), items[id])

			return { ...items, [id]: new_item }
		})

const handle_set_field: DataHandler<"ordo_main.data.fields.set"> =
	$ =>
	({ id, key, value }) =>
		$.update("data.root", items => {
			if (!items[id]) throw ordo.rrr.enoent(ORDO.RRR.REASON.DATA_NOT_FOUND, [id, "data.fields.set"])
			if (!check_permissions()) throw ordo.rrr.eperm(ORDO.RRR.REASON.DATA_UPDATE_PERMISSION_DENIED, [id])

			const fields = { ...ordo.data.get_fields(items[id]), [key]: value }
			const new_item = ordo.data.update({ fields }, uid(), items[id])

			return { ...items, [id]: new_item }
		})

const handle_add_label: DataHandler<"ordo_main.data.labels.add"> =
	$ =>
	({ id, labels: new_labels }) =>
		$.update("data.root", items => {
			if (!items[id]) throw ordo.rrr.enoent(ORDO.RRR.REASON.DATA_NOT_FOUND, [id, "data.labels.add"])
			if (!check_permissions()) throw ordo.rrr.eperm(ORDO.RRR.REASON.DATA_UPDATE_PERMISSION_DENIED, [id])

			const existing_labels = ordo.data.get_labels(items[id])
			const missing_labels = new_labels.filter(l => !existing_labels.some(el => el.color === l.color && el.text === l.text))
			const labels = [...existing_labels, ...missing_labels]
			const new_item = ordo.data.update({ labels }, uid(), items[id])

			return { ...items, [id]: new_item }
		})

const handle_delete_label: DataHandler<"ordo_main.data.labels.delete"> =
	$ =>
	({ id, labels: labels_to_remove }) =>
		$.update("data.root", items => {
			if (!items[id]) throw ordo.rrr.enoent(ORDO.RRR.REASON.DATA_NOT_FOUND, [id, "data.labels.delete"])
			if (!check_permissions()) throw ordo.rrr.eperm(ORDO.RRR.REASON.DATA_UPDATE_PERMISSION_DENIED, [id])

			const existing_labels = ordo.data.get_labels(items[id])
			const labels = existing_labels.filter(el => !labels_to_remove.some(l => l.color === el.color && l.text === el.text))
			const new_item = ordo.data.update({ labels }, uid(), items[id])

			return { ...items, [id]: new_item }
		})

const handle_add_link: DataHandler<"ordo_main.data.links.add"> =
	$ =>
	({ id, links: new_links }) =>
		$.update("data.root", items => {
			if (!items[id]) throw ordo.rrr.enoent(ORDO.RRR.REASON.DATA_NOT_FOUND, [id, "data.links.add"])
			if (!check_permissions()) throw ordo.rrr.eperm(ORDO.RRR.REASON.DATA_UPDATE_PERMISSION_DENIED, [id])

			const existing_links = ordo.data.get_links(items[id])
			const missing_links = new_links.filter(l => !existing_links.includes(l))
			const links = [...existing_links, ...missing_links]
			const new_item = ordo.data.update({ links }, uid(), items[id])

			return { ...items, [id]: new_item }
		})

const handle_delete_link: DataHandler<"ordo_main.data.links.delete"> =
	$ =>
	({ id, links: links_to_remove }) =>
		$.update("data.root", items => {
			if (!items[id]) throw ordo.rrr.enoent(ORDO.RRR.REASON.DATA_NOT_FOUND, [id, "data.links.delete"])
			if (!check_permissions()) throw ordo.rrr.eperm(ORDO.RRR.REASON.DATA_UPDATE_PERMISSION_DENIED, [id])

			const existing_links = ordo.data.get_links(items[id])
			const links = existing_links.filter(l => !links_to_remove.includes(l))
			const new_item = ordo.data.update({ links }, uid(), items[id])

			return { ...items, [id]: new_item }
		})

const handle_move: DataHandler<"ordo_main.data.move"> =
	$ =>
	({ id, parent }) =>
		$.update("data.root", items => {
			if (!items[id]) throw ordo.rrr.enoent(ORDO.RRR.REASON.DATA_NOT_FOUND, [id, "data.move"])
			if (!check_permissions()) throw ordo.rrr.eperm(ORDO.RRR.REASON.DATA_UPDATE_PERMISSION_DENIED, [id])

			const current_parent = ordo.data.get_parent(items[id])

			if (current_parent === parent) return items

			const children = ordo.data.get_children(parent, items)
			const current_name = ordo.data.get_name(items[id])

			if (children.some(ordo.data.has_name(current_name)))
				throw ordo.rrr.eexist(ORDO.RRR.REASON.DATA_ALREADY_EXISTS, [id, current_name, "data.move"])

			if (parent !== null) {
				const descendents = ordo.data.get_descendents(id, items, [])

				if (descendents.some(ordo.data.has_id(parent)))
					throw ordo.rrr.einval(ORDO.RRR.REASON.DATA_DESCENDENT_CANNOT_BE_PARENT, [id, parent, "data.move"])
			}

			const new_item = ordo.data.update({ parent }, uid(), items[id])

			return { ...items, [id]: new_item }
		})

const handle_rename: DataHandler<"ordo_main.data.rename"> =
	$ =>
	({ id, name }) =>
		$.update("data.root", items => {
			if (!items[id]) throw ordo.rrr.enoent(ORDO.RRR.REASON.DATA_NOT_FOUND, [id, "data.rename"])
			if (!check_permissions()) throw ordo.rrr.eperm(ORDO.RRR.REASON.DATA_UPDATE_PERMISSION_DENIED, [id])

			const parent = ordo.data.get_parent(items[id])
			const children = ordo.data.get_children(parent, items)

			if (children.some(ordo.data.has_name(name)))
				throw ordo.rrr.eexist(ORDO.RRR.REASON.DATA_ALREADY_EXISTS, [id, name, "data.rename"])

			const new_item = ordo.data.update({ name }, uid(), items[id])

			return { ...items, [id]: new_item }
		})

const handle_set_group: DataHandler<"ordo_main.data.set_group"> =
	$ =>
	({ id /*group*/ }) =>
		$.update("data.root", items => {
			if (!items[id]) throw ordo.rrr.enoent(ORDO.RRR.REASON.DATA_NOT_FOUND, [id, "data.set_group"])
			if (!check_permissions()) throw ordo.rrr.eperm(ORDO.RRR.REASON.DATA_UPDATE_PERMISSION_DENIED, [id])

			// TODO Throw error if editor is not owner

			return items
		})

const handle_set_location: DataHandler<"ordo_main.data.set_location"> =
	$ =>
	({ id, location }) =>
		$.update("data.root", items => {
			if (!items[id]) throw ordo.rrr.enoent(ORDO.RRR.REASON.DATA_NOT_FOUND, [id, "data.set_location"])
			if (!check_permissions()) throw ordo.rrr.eperm(ORDO.RRR.REASON.DATA_UPDATE_PERMISSION_DENIED, [id])

			const current_location = ordo.data.get_location(items[id])

			if (current_location === location) return items

			const new_item = ordo.data.update({ location }, uid(), items[id])

			return { ...items, [id]: new_item }
		})

const handle_set_owner: DataHandler<"ordo_main.data.set_owner"> =
	$ =>
	({ id /*owner*/ }) =>
		$.update("data.root", items => {
			if (!items[id]) throw ordo.rrr.enoent(ORDO.RRR.REASON.DATA_NOT_FOUND, [id, "data.set_owner"])
			if (!check_permissions()) throw ordo.rrr.eperm(ORDO.RRR.REASON.DATA_UPDATE_PERMISSION_DENIED, [id])

			// TODO Throw error if editor is not owner
			// TODO Pass to new owner

			return items
		})

const handle_set_permissions: DataHandler<"ordo_main.data.set_permissions"> =
	$ =>
	({ id /*permissions*/ }) =>
		$.update("data.root", items => {
			if (!items[id]) throw ordo.rrr.enoent(ORDO.RRR.REASON.DATA_NOT_FOUND, [id, "data.set_permissions"])
			if (!check_permissions()) throw ordo.rrr.eperm(ORDO.RRR.REASON.DATA_UPDATE_PERMISSION_DENIED, [id])

			// TODO Disallow permissions higher than the editor has

			return items
		})

const uid = () => null

const check_permissions = () => true
