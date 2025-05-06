import { maoka, maoka_dom, maoka_styled } from "@ordo-pink/maoka"
import { bs_question_circle } from "@ordo-pink/frontend-icons"
import { button } from "@ordo-pink/core"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"
import { noop } from "@ordo-pink/tau"
import { oath } from "@ordo-pink/oath"

import { auth$ } from "../auth.state"

export const verify_code_modal = maoka.create<Ordo.State>("div", ({ fetch, hosts, hunter, use }) => {
	use(maoka_jabs.set_class("auth_join-modal"))

	const handle_cancel_click = () => void hunter.shoot("modal.hide")

	const handle_mount = () => {
		const divorce_code = auth$.cheat("code", code => {
			if (code.length !== 6) return

			const email = auth$.select("email")

			oath
				.of(new Headers())
				.pipe(oath.ops.tap(h => h.append("Content-Type", "application/json")))
				.pipe(oath.ops.map(headers => ({ headers, method: "POST", credentials: "include" as const })))
				.pipe(oath.ops.map(init => ({ ...init, body: JSON.stringify({ code: Number(code), email }) })))
				// TODO Show loader
				.pipe(oath.ops.chain(init => oath.from_promise(() => fetch(`${hosts.au}/verify-code`, init))))
				.pipe(oath.ops.and(res => res.json()))
				.pipe(oath.ops.chain(res => oath.if(res.success, { on_true: () => res.payload })))
				.pipe(oath.ops.tap(user => auth$.each({ email: () => "", code: () => "", user: () => user })))
				.pipe(oath.ops.tap(() => hunter.shoot("modal.hide")))
				.cata(oath.catas.to_promise())
				// TODO Send success notification
				.catch(noop) // TODO Show error
		})

		return () => {
			divorce_code()
		}
	}

	use(maoka_dom.jabs.onmount(handle_mount))

	return () => [
		internal.title(() => "Join ORDO"),
		internal.hint(() => "Make sure you enter your email correctly. We'll send you a code that will let you in."),
		internal.code_input(),
		internal.button_section(() => [
			button.neutral({ on_click: () => handle_cancel_click(), kindergarten: () => "Cancel", hotkey: "escape" }),
		]),
	]
})

namespace internal {
	export const title = maoka_styled.h1("auth_join-modal_title")

	export const button_section = maoka_styled.div("auth_join-modal_actions")

	export const hint = maoka_styled.p()

	export const code_input = maoka.create("label", ({ use }) => {
		use(maoka_jabs.set_class("auth_join-modal_email_wrapper"))

		return () => [bs_question_circle({}), input()]
	})

	const input = maoka_styled.input("auth_join-modal_email", ({ use }) => {
		const t_placeholer = "123456" // TODO i18n
		const value = auth$.select("code")

		const handle_mount = () => use(maoka_dom.jabs.if_dom(n => n.value.focus()))
		const handle_input = (event: Event) => {
			const target = event.target as HTMLInputElement
			auth$.update("code", () => target.value)
		}

		use(maoka_jabs.set_id("code-input"))
		use(maoka_jabs.set_attribute("type", "number"))
		use(maoka_jabs.set_attribute("placeholder", t_placeholer))
		use(maoka_jabs.listen("oninput", handle_input))
		use(maoka_dom.jabs.onmount(handle_mount))

		if (value) use(maoka_jabs.set_attribute("value", value))
	})
}
