/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { type Core, core } from "@ordo-pink/sdk-core"
import { bs_question_circle } from "@ordo-pink/frontend-icons"
import { client_maoka } from "@ordo-pink/sdk-client-maoka"
import { client_rrr } from "@ordo-pink/sdk-client"
import { get_device_info } from "@ordo-pink/_get-device-info"
import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_styled } from "@ordo-pink/oss-maoka/styled"
import { oath } from "@ordo-pink/oss-oath"

import { authenticating_user$ } from "../user.state"

import "./modal.styles.css"

export const verify_code_modal = maoka.create("div", ({ use }) => {
	const { auth$, fetch, hosts, hunter } = use(client_maoka.context.consume)

	use(client_maoka.jabs.classes.set("user_join-modal"))

	const t_title = use(client_maoka.jabs.translate$("user_modals_verify_title"))
	const t_hint = use(client_maoka.jabs.translate$("user_modals_verify_hint"))
	const t_submit = use(client_maoka.jabs.translate$("user_modals_verify_submit"))
	const t_cancel = use(client_maoka.jabs.translate$("user_common_cancel"))

	const handle_cancel_click = () => void hunter.shoot("modal.hide")

	const handle_ok_click = () => {
		const { code, email } = authenticating_user$.unwrap()

		if (code.length !== 6) {
			authenticating_user$.update("code", () => "")

			hunter.shoot("notifications.rrr", client_rrr.einval("user_rrr_invalid_code_length"))

			return
		}
		if (email.length < 5 || email.length > 255) {
			authenticating_user$.update("email", () => "")
			authenticating_user$.update("code", () => "")

			hunter.shoot("modal.hide")
			hunter.shoot("notifications.rrr", client_rrr.einval("user_rrr_invalid_email_length"))

			return
		}

		if (!core.user.email_guard(email)) {
			authenticating_user$.update("email", () => "")
			authenticating_user$.update("code", () => "")

			hunter.shoot("modal.hide")
			hunter.shoot("notifications.rrr", client_rrr.einval("user_rrr_invalid_email"))

			return
		}

		void oath
			.of(new Headers())
			.pipe(oath.ops.tap(h => h.append("X-Device", get_device_info.get_device_info(navigator))))
			.pipe(oath.ops.tap(h => h.append("Content-Type", "application/json")))
			.pipe(oath.ops.map(headers => ({ headers, method: "POST", credentials: "include" as const })))
			.pipe(oath.ops.map(init => ({ ...init, body: JSON.stringify([email, code]) })))
			.pipe(oath.ops.chain(init => oath.from_promise(() => fetch(`${hosts.id}/auth/verify-code`, init))))
			.pipe(oath.ops.chain(res => oath.if(res.status < 300, { t: () => res })))
			.pipe(oath.ops.and(res => res.json() as Promise<Core.User.Instance>))
			.pipe(oath.ops.tap(() => authenticating_user$.each({ email: () => "", code: () => "" })))
			.pipe(oath.ops.tap(user => auth$.update("user", () => user)))
			.pipe(oath.ops.tap(() => hunter.shoot("modal.hide")))
			.cata(oath.catas.to_promise())
			.finally(() => hunter.shoot("background_status.none"))
	}

	return () => [
		title(t_title),
		hint(t_hint),
		code_input(),
		button_section(() => [
			client_maoka.components.button.neutral({ hotkey: "escape", kindergarten: t_cancel, on_click: handle_cancel_click }),
			client_maoka.components.button.primary({ hotkey: "enter", kindergarten: t_submit, on_click: handle_ok_click }),
		]),
	]
})

// --- Internal ---

const title = maoka_styled.h1("user_join-modal_title")

const button_section = maoka_styled.div("user_join-modal_actions")

const hint = maoka_styled.p()

const code_input = maoka.create("label", ({ use }) => {
	use(client_maoka.jabs.classes.set("user_join-modal_email_wrapper"))

	return () => [bs_question_circle({}), input()]
})

const input = maoka_styled.input("user_join-modal_email", ({ use }) => {
	const t_placeholer = "123456" // TODO i18n
	const value = authenticating_user$.select("code")

	const handle_mount = () => use(maoka.dom.jabs.hit_if_dom(n => n.value.focus()))
	const handle_input = (event: Event) => {
		const target = event.target as HTMLInputElement
		authenticating_user$.update("code", () => target.value)
	}

	use(client_maoka.jabs.set_id("code-input"))
	use(client_maoka.jabs.set_attribute("type", "number"))
	use(client_maoka.jabs.set_attribute("placeholder", t_placeholer))
	use(client_maoka.jabs.listen("oninput", handle_input))
	use(maoka.dom.jabs.onmount(handle_mount))

	if (value) use(client_maoka.jabs.set_attribute("value", value))
})
