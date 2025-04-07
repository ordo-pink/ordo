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

import { BsBoxArrowInRight, BsBoxArrowRight } from "@ordo-pink/frontend-icons"
import { CommandPaletteItemType, CurrentUser, rrr } from "@ordo-pink/core"
import { /* CheckboxInput, */ Dialog, Input } from "@ordo-pink/maoka-components"
import { call_once, noop } from "@ordo-pink/tau"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { Result } from "@ordo-pink/result"
import { console_logger } from "@ordo-pink/logger"
import { oath } from "@ordo-pink/oath"

import { UserQuery } from "./data/user/user-query.impl"
import { ordo_app_state } from "../app.state"

export const init_user = call_once(() => {
	const { known_functions, fetch, logger, hosts, commands } = ordo_app_state.zags.unwrap()

	const handle_show_request_code: Ordo.Command.HandlerOf<"cmd.auth.show_request_code_modal"> = () =>
		void commands.emit("cmd.application.modal.show", { render: () => RequestCodeModal })

	const handle_show_validate_code: Ordo.Command.HandlerOf<"cmd.auth.show_validate_code_modal"> = email =>
		void commands.emit("cmd.application.modal.show", { render: () => ValidateCodeModal(email) })

	// TODO Invalidate cookie instead of token
	const handle_sign_out = () =>
		oath
			.of({ method: "DELETE", credentials: "include" as const })
			.pipe(oath.ops.and(init => oath.try(() => fetch(`${hosts.id}/session`, init))))
			.cata(oath.catas.to_promise())
			.then(clean_up_auth)
			.then(() => {
				const history_length = history.length
				history.go(-history_length)
				window.location.replace("/")
			})

	logger.debug("🟡 Initialising metadata...")

	oath
		.from_promise(() => fetch(`${hosts.id}/session`, { credentials: "include" }))
		.pipe(oath.ops.and(res => res.json()))
		.pipe(oath.ops.and(res => oath.if(res.success, { on_true: () => res.payload as Ordo.User.Current.DTO })))
		.pipe(oath.ops.and(dto => CurrentUser.FromDTO(dto)))
		.pipe(oath.ops.and(user => ordo_app_state.zags.update("user", () => user)))
		.cata(oath.catas.to_promise())
		.catch(noop)

	ordo_app_state.zags.cheat("user", user => {
		if (user) {
			commands.off("cmd.auth.show_request_code_modal", handle_show_request_code)
			commands.off("cmd.auth.show_validate_code_modal", handle_show_validate_code)
			commands.emit("cmd.application.command_palette.remove", "t.auth.join")
			commands.emit("cmd.application.command_palette.add", {
				readable_name: "t.auth.leave",
				value: handle_sign_out,
				type: CommandPaletteItemType.DESTRUCTIVE_ACTION,
				render_icon: BsBoxArrowRight,
			})
		} else {
			commands.on("cmd.auth.show_request_code_modal", handle_show_request_code)
			commands.on("cmd.auth.show_validate_code_modal", handle_show_validate_code)
			commands.emit("cmd.application.command_palette.add", {
				readable_name: "t.auth.join",
				type: CommandPaletteItemType.MODAL_OPENER,
				value: handle_show_request_code,
				render_icon: BsBoxArrowInRight,
			})
		}
	})

	const user_query = UserQuery.Of(() => Result.Ok(void 0))

	ordo_app_state.zags.update("queries.user", () => user_query)

	logger.debug("🟢 Initialised metadata.")

	return {
		get_user_query: (fid: symbol) =>
			UserQuery.Of(permission =>
				Result.If(known_functions.has_permissions(fid, { queries: [permission] }), {
					F: () => {
						const e = rrr.codes.eperm(`UserQuery permission RRR. Did you forget to request query permission '${permission}'?`)
						console_logger.error(e.message)
						return e
					},
				}),
			),
	}
})

const clean_up_auth = () => {
	history.go(-history.length)
	window.location.replace("/")
}

const RequestCodeModal = Maoka.create("div", ({ use }) => {
	let email = ""
	// let consent = false
	let is_valid = false

	const commands = use(MaokaOrdo.Jabs.get_commands)
	const fetch = use(MaokaOrdo.Jabs.get_fetch)
	const au_host = ordo_app_state.zags.select("hosts.au")

	// TODO Show hint
	// const t_hint = "We'll send you a magic link that will let you in." // TODO i18n
	const t_title = "Enter email" // TODO i18n
	const t_email_validation_error = "Put valid email" // TODO i18n
	const t_input_label = "Email" // TODO i18n
	const t_input_placeholder = "jacques@villeneuve.ca" // TODO i18n
	const t_next = "Next" // TODO i18n
	const t_checkbox_label =
		"I consent to the fact that you'll store stuff on my computer, and I don't mind as long as you don't share it." // TODO i18n

	const validate = CurrentUser.Validations.is_email

	const handle_input = (event: Event) => {
		const target = event.target as HTMLInputElement
		email = target.value
		is_valid = validate(email)
	}

	// const handle_checkbox_change = () => {
	// 	consent = !consent
	// }

	return () =>
		// TODO render_icon
		Dialog({
			action: () =>
				oath
					.if(is_valid /* && consent */)
					.pipe(oath.ops.and(() => new Headers()))
					.pipe(oath.ops.tap(headers => headers.append("content-type", "application/json")))
					.pipe(oath.ops.and(headers => ({ headers, method: "POST" })))
					.pipe(oath.ops.and(init => ({ ...init, body: JSON.stringify({ email }) })))
					// TODO Get input from env
					.pipe(oath.ops.and(init => oath.from_promise(() => fetch(`${au_host}/request-code`, init))))
					.pipe(oath.ops.and(res => res.json()))
					.pipe(oath.ops.and(res => oath.if(res.success)))
					.pipe(oath.ops.and(() => commands.emit("cmd.auth.show_validate_code_modal", email as Ordo.User.Email)))
					.cata(oath.catas.to_promise()),
			action_hotkey: "shift+enter",
			action_text: t_next,
			body: () => {
				const autofocus = true
				const placeholder = t_input_placeholder
				const initial_value = email
				const on_input = handle_input
				const validation_error_message = t_email_validation_error
				let label = t_input_label

				const input_params = { autofocus, label, placeholder, initial_value, on_input, validate, validation_error_message }

				// const on_change = handle_checkbox_change
				label = t_checkbox_label

				// const checkbox_params = { on_change, checked: consent, label }

				return [
					CodeModalInputWrapper(() => () => Input.Email(input_params)),
					// RequestCodeModalCheckboxWrapper(() => () => CheckboxInput(checkbox_params)),
				]
			},
			title: t_title,
		})
})

// const RequestCodeModalCheckboxWrapper = MaokaStyled.Tags.div("px-8")

const CodeModalInputWrapper = MaokaStyled.Tags.div("py-4")

const ValidateCodeModal = (email: Ordo.User.Email) =>
	Maoka.create("div", ({ use }) => {
		let code = ""
		let is_valid = false

		const commands = use(MaokaOrdo.Jabs.get_commands)
		const fetch = use(MaokaOrdo.Jabs.get_fetch)
		const au_host = ordo_app_state.zags.select("hosts.au")

		const validate = (x: string) => /^\d{6}$/.test(x)

		const on_input = (event: Event) => {
			const target = event.target as HTMLInputElement
			code = target.value
			is_valid = validate(code)
		}

		const t_email_code_validation_error = "Put valid email code" // TODO i18n

		return () =>
			Dialog({
				action: () =>
					oath
						.if(is_valid)
						.pipe(oath.ops.and(() => new Headers()))
						.pipe(oath.ops.tap(headers => headers.append("content-type", "application/json")))
						.pipe(oath.ops.and(headers => ({ headers, method: "POST" })))
						.pipe(
							oath.ops.and(init => ({
								...init,
								body: JSON.stringify({ email, code: Number(code) }),
								credentials: "include" as const,
							})),
						)
						// TODO Get input from env
						.pipe(oath.ops.and(init => oath.from_promise(() => fetch(`${au_host}/verify-code`, init))))
						.pipe(oath.ops.and(res => res.json()))
						.pipe(oath.ops.and(res => oath.if(res.success, { on_true: () => res.payload })))
						.pipe(oath.ops.and(user => ordo_app_state.zags.update("user", () => CurrentUser.FromDTO(user))))
						.pipe(oath.ops.and(() => commands.emit("cmd.application.modal.hide")))
						.cata(oath.catas.to_promise()),
				action_text: "Join",
				title: "Enter code",
				action_hotkey: "enter",
				// TODO render_icon
				body: () => [
					CodeModalInputWrapper(
						() => () =>
							Input.Text({
								autofocus: true,
								label: "Email Code", // TODO i18n
								placeholder: "123456",
								initial_value: code,
								on_input,
								validate,
								validation_error_message: t_email_code_validation_error,
							}),
					),
				],
			})
	})
