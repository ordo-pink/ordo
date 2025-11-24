/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"
import { maoka_styled } from "@ordo-pink/oss-maoka-styled"

import "./rename-file-modal.styles.css"

type RenameFileModalArgs = { state: OrdoClient.F.State; id: Ordo.Data.Id }
export const rename_file_modal = maoka.create<RenameFileModalArgs>("div", async ({ id, state, use }) => {
	use(ordo_client_maoka.context.provide(state))
	use(ordo_client_maoka.jabs.set_id("rename-file-modal"))
	await use(ordo_client_maoka.jabs.add_translations("en", en_values, "async"))

	const get_data = use(ordo_client_maoka.jabs.data.get_by_id$(id))
	const data = get_data()

	let value = data ? ordo.data.get_name(data) : ""

	const translate = use(ordo_client_maoka.jabs.translate$)
	const handle_input_change = (new_value: string) => void (value = new_value)
	const handle_cancel = () => void state.hunter.shoot("modal.hide")
	const notify_success = () =>
		state.hunter.shoot("notification.show", {
			title: "rename_file_modal_notification_title",
			message: value,
			type: ORDO_CLIENT.NOTIFICATION.TYPE.SUCCESS,
			duration_s: 3,
		})
	const handle_ok = () =>
		void state.hunter
			.shoot("data.rename", { name: value, id })
			.to_promise()
			.then(notify_success)
			.catch(rrr => state.hunter.shoot("notification.rrr", rrr))
			.finally(() => state.hunter.shoot("modal.hide"))

	return () => [
		title(() => translate("rename_file_modal_title")),
		input({ handle_input_change, value, placeholder: translate("rename_file_modal_input_placeholder") }),
		button_group(() => [
			ordo_client_maoka.components.button.neutral({ on_click: handle_cancel, hotkey: "esc", kindergarten: () => "Cancel" }),
			ordo_client_maoka.components.button.primary({ on_click: handle_ok, hotkey: "enter", kindergarten: () => "OK" }),
		]),
	]
})

// --- Internal ---

const button_group = maoka_styled.div("button-group")

const title = maoka_styled.div("title")

const input = maoka.create<{ value: string; handle_input_change: (value: string) => void; placeholder: string }>(
	"input",
	({ handle_input_change, placeholder, use, value }) => {
		use(ordo_client_maoka.jabs.set_attribute("value", value))
		use(ordo_client_maoka.jabs.set_attribute("type", "text"))
		use(ordo_client_maoka.jabs.set_attribute("placeholder", placeholder))
		use(ordo_client_maoka.jabs.listen("onchange", e => handle_input_change((e.target as any).value)))
		use(maoka_dom.jabs.onmount(n => n.value.focus()))
	},
)

const en_values = {
	rename_file_modal_title: "Rename the File",
	rename_file_modal_input_placeholder: "Oh, just a file",
	rename_file_modal_notification_title: "File renamed",
}
