/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"
import { maoka_styled } from "@ordo-pink/oss-maoka-styled"

import "./create-file-modal.styles.css"

type CreateFileModalArgs = { state: OrdoClient.F.GlobalState; parent: Ordo.Data.Parent; on_created?: () => void }
export const create_file_modal = maoka.create<CreateFileModalArgs>("div", async ({ on_created, parent, state, use }) => {
	let value = ""

	use(ordo_client_maoka.context.provide(state))
	use(ordo_client_maoka.jabs.set_id("create-file-modal"))
	await use(ordo_client_maoka.jabs.add_translations("en", en_values, "async"))

	const translate = use(ordo_client_maoka.jabs.translate$)
	const handle_input_change = (new_value: string) => void (value = new_value)
	const handle_cancel = () => void state.hunter.shoot("@ordo/main.modal.hide")
	const notify_success = () =>
		state.hunter.shoot("@ordo/main.notification.show", {
			title: "create_file_modal_notification_title",
			message: value,
			type: ORDO_CLIENT.NOTIFICATION.TYPE.SUCCESS,
			duration_s: 3,
		})
	const handle_ok = () =>
		void state.hunter
			.shoot("@ordo/main.data.create", { name: value, parent })
			.to_promise()
			.then(() => on_created && on_created())
			.then(notify_success)
			.catch(rrr => state.hunter.shoot("@ordo/main.notification.rrr", rrr))
			.finally(() => state.hunter.shoot("@ordo/main.modal.hide"))

	return () => [
		title(() => translate("create_file_modal_title")),
		input({ handle_input_change, value, placeholder: translate("create_file_modal_input_placeholder") }),
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
		use(ordo_client_maoka.jabs.listen("change", e => handle_input_change((e.target as any).value)))
		use(maoka_dom.jabs.onmount(n => n.value.focus()))
	},
)

const en_values = {
	create_file_modal_title: "Create a File",
	create_file_modal_input_placeholder: "Oh, just a file",
	create_file_modal_notification_title: "File created",
}
