import { maoka, maoka_dom, maoka_styled } from "@ordo-pink/maoka"
import { bs_question_circle } from "@ordo-pink/frontend-icons"
import { current_user } from "@ordo-pink/core"
import { get_device_info } from "@ordo-pink/get-device-info"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"
import { noop } from "@ordo-pink/tau"
import { oath } from "@ordo-pink/oath"

import { auth$ } from "../auth.state"

export const verify_code_modal = maoka.create("div", ({ use }) => {
	const { fetch, hosts, hunter } = use(maoka_sdk.context.consume)

	use(maoka_jabs.set_class("auth_join-modal"))

	const t_title = use(maoka_sdk.jabs.translate$("auth_modals_verify_title"))
	const t_hint = use(maoka_sdk.jabs.translate$("auth_modals_verify_hint"))
	const t_submit = use(maoka_sdk.jabs.translate$("auth_modals_verify_submit"))
	const t_cancel = use(maoka_sdk.jabs.translate$("auth_common_cancel"))

	const handle_cancel_click = () => void hunter.shoot("modal.hide")

	const handle_ok_click = () => {
		const { code, email } = auth$.unwrap()

		if (code.length !== 6 || email.length < 5 || email.length > 255 || !current_user.validations.is_email(email)) {
			return // TODO Show error
		}

		// TODO Use proper session ids

		oath
			.of(new Headers())
			.pipe(oath.ops.tap(h => h.append("X-Device", get_device_info(navigator))))
			.pipe(oath.ops.tap(h => h.append("Content-Type", "application/json")))
			.pipe(oath.ops.map(headers => ({ headers, method: "POST", credentials: "include" as const })))
			.pipe(oath.ops.map(init => ({ ...init, body: JSON.stringify({ code: Number(code), email }) })))
			.pipe(oath.ops.chain(init => oath.from_promise(() => fetch(`${hosts.au}/verify-code`, init))))
			.pipe(oath.ops.and(res => res.json()))
			.pipe(oath.ops.chain(res => oath.if(res.success, { on_true: () => res.payload })))
			.pipe(oath.ops.tap(user => auth$.each({ email: () => "", code: () => "", user: () => user })))
			.pipe(oath.ops.tap(() => hunter.shoot("modal.hide")))
			.cata(oath.catas.to_promise())
			.catch(noop) // TODO Show error
	}

	return () => [
		title(t_title),
		hint(t_hint),
		code_input(),
		button_section(() => [
			maoka_sdk.components.button.neutral({ hotkey: "escape", kindergarten: t_cancel, on_click: handle_cancel_click }),
			maoka_sdk.components.button.primary({ hotkey: "enter", kindergarten: t_submit, on_click: handle_ok_click }),
		]),
	]
})

// --- Internal ---

const title = maoka_styled.h1("auth_join-modal_title")

const button_section = maoka_styled.div("auth_join-modal_actions")

const hint = maoka_styled.p()

const code_input = maoka.create("label", ({ use }) => {
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
