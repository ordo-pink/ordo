/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_styled } from "@ordo-pink/oss-maoka-styled"

import "./delete-file-modal.styles.css"

type DeleteFileModalArgs = { state: OrdoClient.F.State; id: Ordo.Data.Id }
export const delete_file_modal = maoka.create<DeleteFileModalArgs>("div", async ({ id, state, use }) => {
	use(ordo_client_maoka.context.provide(state))
	use(ordo_client_maoka.jabs.set_id("delete-file-modal"))
	await use(ordo_client_maoka.jabs.add_translations("en", en_values, "async"))

	const get_data = use(ordo_client_maoka.jabs.data.get_by_id$(id))
	const item = get_data()

	const hunter = use(ordo_client_maoka.jabs.hunter)
	const translate = use(ordo_client_maoka.jabs.translate$)
	const handle_cancel = () => void state.hunter.shoot("modal.hide")
	const notify_success = () =>
		state.hunter.shoot("notification.show", {
			title: "delete_file_modal_notification_title",
			message: ordo.data.get_name(item!),
			type: ORDO_CLIENT.NOTIFICATION.TYPE.SUCCESS,
			duration_s: 3,
		})
	const handle_ok = () =>
		void state.hunter
			.shoot("data.delete", { id })
			.to_promise()
			.then(notify_success)
			.then(() => ordo.data.get_parent(item!))
			.then(id => (id ? hunter.shoot("ordo.filet.open_file", { id }) : hunter.shoot("ordo.filet.open")))
			.catch(rrr => state.hunter.shoot("notification.rrr", rrr))
			.finally(() => state.hunter.shoot("modal.hide"))

	if (!item) {
		hunter.shoot("notification.rrr", ordo.rrr.enoent(ORDO.RRR.REASON.DATA_NOT_FOUND, id))
		hunter.shoot("modal.hide")
	}

	return () => [
		title(() => translate("delete_file_modal_title")),
		hint(() => translate("delete_file_modal_input_hint")),
		button_group(() => [
			ordo_client_maoka.components.button.neutral({ on_click: handle_cancel, hotkey: "esc", kindergarten: () => "Cancel" }),
			ordo_client_maoka.components.button.primary({ on_click: handle_ok, hotkey: "enter", kindergarten: () => "OK" }),
		]),
	]
})

// --- Internal ---

const button_group = maoka_styled.div("button-group")
const hint = maoka_styled.p("hint")
const title = maoka_styled.div("title")

const en_values = {
	delete_file_modal_title: "Delete the File",
	delete_file_modal_input_hint: "Are you sure? This action is irreversible. All descendent files will be removed as well.",
	delete_file_modal_notification_title: "File deleted",
}
