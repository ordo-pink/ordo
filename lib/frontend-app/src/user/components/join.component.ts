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

import { maoka, maoka_dom, maoka_styled } from "@ordo-pink/maoka"
import { bs_envelope_at } from "@ordo-pink/frontend-icons"
import { client_rrr } from "@ordo-pink/sdk-client"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"
import { oath } from "@ordo-pink/oath"
import { user } from "@ordo-pink/sdk-core"

import { authenticating_user$ } from "../user.state"

import "./modal.styles.css"

export const join_modal = maoka.create("div", ({ use }) => {
	use(maoka_sdk.jabs.classes.set("user_join-modal"))

	const { fetch, hosts, hunter } = use(maoka_sdk.context.consume)

	const t_title = use(maoka_sdk.jabs.translate$("user_modals_join_title"))
	const t_hint = use(maoka_sdk.jabs.translate$("user_modals_join_title"))
	const t_join = use(maoka_sdk.jabs.translate$("user_modals_join_join"))
	const t_cancel = use(maoka_sdk.jabs.translate$("user_common_cancel"))

	const on_cancel_click = () => void hunter.shoot("modal.hide")

	const on_ok_click = () => {
		const email = authenticating_user$.select("email")

		if (email.length < 5 || email.length > 255)
			return void hunter.shoot("notifications.rrr", client_rrr.einval("user_rrr_invalid_email_length"))
		if (!user.current.validations.is_email(email))
			return void hunter.shoot("notifications.rrr", client_rrr.einval("user_rrr_invalid_email"))

		oath
			.of(new Headers())
			.pipe(oath.ops.tap(h => h.append("Content-Type", "application/json")))
			.pipe(oath.ops.map(headers => ({ headers, method: "POST", body: JSON.stringify({ email }) })))
			.pipe(oath.ops.chain(init => oath.from_promise(() => fetch(`${hosts.au}/request-code`, init))))
			.pipe(oath.ops.chain(res => oath.if(res.status < 300, { on_true: () => res })))
			.pipe(oath.ops.tap(() => hunter.shoot("user.show_verify_code_modal")))
			.cata(oath.catas.to_promise())
			.catch(() => void 0)
			.finally(() => hunter.shoot("background_status.none"))
	}

	return () => [
		title(t_title),
		hint(t_hint),
		email_input(),
		button_section(() => [
			maoka_sdk.components.button.neutral({ hotkey: "escape", kindergarten: t_cancel, on_click: on_cancel_click }),
			maoka_sdk.components.button.primary({ hotkey: "enter", kindergarten: t_join, on_click: on_ok_click }),
		]),
	]
})

// --- Internal ---

const title = maoka_styled.h1("user_join-modal_title")

const button_section = maoka_styled.div("user_join-modal_actions")

const hint = maoka_styled.p()

const email_input = maoka.create("label", ({ use }) => {
	use(maoka_sdk.jabs.classes.set("user_join-modal_email_wrapper"))

	return () => [bs_envelope_at({}), search()]
})

const search = maoka_styled.input("user_join-modal_email", ({ use }) => {
	const t_placeholder = use(maoka_sdk.jabs.translate$("user_modals_join_placeholder"))
	const value = authenticating_user$.select("email")

	const handle_mount = () => use(maoka_dom.jabs.if_dom(n => n.value.focus()))
	const handle_input = (event: Event) => {
		const target = event.target as HTMLInputElement
		authenticating_user$.update("email", () => target.value)
	}

	use(maoka_sdk.jabs.set_id("email-input"))
	use(maoka_sdk.jabs.set_attribute("type", "email"))
	use(maoka_sdk.jabs.set_attribute("placeholder", t_placeholder()))
	use(maoka_sdk.jabs.listen("oninput", handle_input))
	use(maoka_dom.jabs.onmount(handle_mount))

	if (value) use(maoka_sdk.jabs.set_attribute("value", value))
})
