import { button, current_user } from "@ordo-pink/core"
import { maoka, maoka_dom, maoka_styled } from "@ordo-pink/maoka"
import { bs_envelope_at } from "@ordo-pink/frontend-icons"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"
import { noop } from "@ordo-pink/tau"
import { oath } from "@ordo-pink/oath"

import { auth$ } from "../auth.state"

export const join_modal = maoka.create<Ordo.State>("div", ({ fetch, hosts, hunter, use }) => {
	use(maoka_jabs.set_class("auth_join-modal"))

	const handle_cancel_click = () => void hunter.shoot("modal.hide")

	const handle_ok_click = () => {
		const email = auth$.select("email")

		if (email.length < 5 || email.length > 255 || !current_user.validations.is_email(email)) {
			return // TODO Show error
		}

		oath
			.of(new Headers())
			.pipe(oath.ops.tap(h => h.append("Content-Type", "application/json")))
			.pipe(oath.ops.map(headers => ({ headers, method: "POST", body: JSON.stringify({ email }) })))
			.pipe(oath.ops.chain(init => oath.from_promise(() => fetch(`${hosts.au}/request-code`, init))))
			.pipe(oath.ops.and(res => res.json()))
			.pipe(oath.ops.chain(res => oath.if(res.success)))
			.pipe(oath.ops.tap(() => hunter.shoot("auth.show_verify_code_modal")))
			.cata(oath.catas.to_promise())
			.catch(noop)
	}

	return () => [
		internal.title(() => "Join ORDO"),
		internal.hint(() => "Make sure you enter your email correctly. We'll send you a code that will let you in."),
		internal.email_input(),
		internal.button_section(() => [
			button.neutral({ on_click: () => handle_cancel_click(), kindergarten: () => "Cancel", hotkey: "escape" }),
			button.primary({ on_click: () => handle_ok_click(), kindergarten: () => "Join", hotkey: "enter" }),
		]),
	]
})

namespace internal {
	export const title = maoka_styled.h1("auth_join-modal_title")

	export const button_section = maoka_styled.div("auth_join-modal_actions")

	export const hint = maoka_styled.p()

	export const email_input = maoka.create("label", ({ use }) => {
		use(maoka_jabs.set_class("auth_join-modal_email_wrapper"))

		return () => [bs_envelope_at({}), search()]
	})

	const search = maoka_styled.input("auth_join-modal_email", ({ use }) => {
		const t_placeholer = "are@you.kidding" // TODO i18n
		const value = auth$.select("email")

		const handle_mount = () => use(maoka_dom.jabs.if_dom(n => n.value.focus()))
		const handle_input = (event: Event) => {
			const target = event.target as HTMLInputElement
			auth$.update("email", () => target.value)
		}

		use(maoka_jabs.set_id("email-input"))
		use(maoka_jabs.set_attribute("type", "email"))
		use(maoka_jabs.set_attribute("placeholder", t_placeholer))
		use(maoka_jabs.listen("oninput", handle_input))
		use(maoka_dom.jabs.onmount(handle_mount))

		if (value) use(maoka_jabs.set_attribute("value", value))
	})
}
