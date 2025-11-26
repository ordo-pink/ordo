/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { bs_x } from "@ordo-pink/frontend-icons"
import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"
import { sweech } from "@ordo-pink/oss-sweech"
import { zags } from "@ordo-pink/oss-zags"

import "./modal.styles.css"

export const modal = maoka.create("div", ({ use }) => {
	const { hunter } = use(ordo_client_maoka.context.consume)

	const handle_click = () => hunter.shoot("ordo_main.modal.hide")
	const handle_show: OrdoClient.Command.GunFor<"ordo_main.modal.show"> = params => $.update("instance", () => params)
	const handle_hide: OrdoClient.Command.GunFor<"ordo_main.modal.hide"> = () => $.update("instance", () => void 0)
	const handle_mount = () =>
		$.cheat("instance", instance => {
			if (instance) use(ordo_client_maoka.jabs.add_class("active"))
			else use(ordo_client_maoka.jabs.remove_class("active"))
		})

	use(maoka_dom.jabs.onmount(handle_mount))
	use(ordo_client_maoka.jabs.set_id("modal-overlay"))
	use(ordo_client_maoka.jabs.listen("click", handle_click))
	use(ordo_client_maoka.jabs.handle_command("ordo_main.modal.hide", handle_hide))
	use(ordo_client_maoka.jabs.handle_command("ordo_main.modal.show", handle_show))
	use(ordo_client_maoka.jabs.add_translations("en", en))

	return () => [modal_window(), close_modal()]
})

// --- Internal ---

const $ = zags.create<{ instance?: OrdoClient.Modal.Instance }>({})

const modal_window = maoka.create("div", ({ use }) => {
	let onunmount: (() => void) | undefined

	const get_modal_instance = use(ordo_client_maoka.jabs.cheat$($, "instance"))

	use(ordo_client_maoka.jabs.set_class("modal"))
	use(ordo_client_maoka.jabs.listen("click", event => event.stopPropagation()))

	return () => {
		const modal_instance = get_modal_instance()

		if (onunmount) {
			onunmount()
			onunmount = undefined
		}

		if (modal_instance) {
			if (modal_instance.onunmount) onunmount = modal_instance.onunmount
			if (modal_instance.size != null) use(ordo_client_maoka.jabs.add_class(modal_size_to_class(modal_instance.size)))

			return content_wrapper()
		} else {
			use(maoka_dom.jabs.if_dom(n => (n.value.innerHTML = "")))
		}
	}
})

const content_wrapper = maoka.create("div", ({ use }) => {
	const modal_instance = $.select("instance")

	use(maoka_dom.jabs.if_dom(n => void modal_instance!.render(n.value as HTMLDivElement)))
})

const modal_size_to_class = (size: OrdoClient.Modal.Size) =>
	sweech
		.match(size)
		.case(ORDO_CLIENT.MODAL.SIZE.SM, () => "sm")
		.case(ORDO_CLIENT.MODAL.SIZE.MD, () => "md")
		.case(ORDO_CLIENT.MODAL.SIZE.LG, () => "lg")
		.case(ORDO_CLIENT.MODAL.SIZE.XL, () => "xl")
		.default(() => "2xl")

const close_modal = maoka.create("div", ({ use }) => {
	const { hunter } = use(ordo_client_maoka.context.consume)
	const translate = use(ordo_client_maoka.jabs.translate$)

	use(ordo_client_maoka.jabs.set_class("modal_close"))
	use(ordo_client_maoka.jabs.listen("click", () => handle_click()))
	use(ordo_client_maoka.jabs.listen_global_event("keydown", e => handle_global_esc(e)))

	const handle_global_esc = (event: KeyboardEvent) => {
		if (event.code !== "Escape" || !$.select("instance")) return

		event.stopImmediatePropagation()
		hunter.shoot("ordo_main.modal.hide")
	}

	const handle_click = () => void hunter.shoot("ordo_main.modal.hide")

	return () => {
		use(ordo_client_maoka.jabs.set_attribute("title", translate("modal_close_hint")))

		return bs_x()
	}
})

const en = { modal_close_hint: "Click here, or anywhere else outside the modal window, or press Escape to close." }
