// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { BsCheck2, BsX } from "react-icons/bs"
import { useEffect, useState } from "react"
import { isEmail } from "validator"

import { EmailInput, PasswordInput, TextInput } from "@ordo-pink/frontend-react-components/input"
import { is_non_empty_string, keys_of } from "@ordo-pink/tau"
import { use$ } from "@ordo-pink/frontend-react-hooks"

import Button from "@ordo-pink/frontend-react-components/button"
import Callout from "@ordo-pink/frontend-react-components/callout"
import Heading from "@ordo-pink/frontend-react-components/heading"
import Link from "@ordo-pink/frontend-react-components/link"
import { RRR } from "@ordo-pink/managers"
import { Switch } from "@ordo-pink/switch"

/**
 * TODO: Replace validations with user validations
 */
export default function SignUp() {
	const commands = use$.commands()
	const current_language = use$.current_language()
	const fetch = use$.fetch()
	const hosts = use$.hosts()
	const translate = use$.translation()

	const [is_privacy_policy_confirmed, set_is_privacy_policy_confirmed] = useState(false)

	const [email, set_email] = useState("")
	const [handle, set_handle] = useState("")
	const [password, set_password] = useState("")
	const [repeat_password, set_repeat_password] = useState("")
	const [is_valid, set_is_valid] = useState({
		email: false,
		handle: false,
		length: false,
		has_digit: false,
		has_capital: false,
		has_symbol: false,
		passwords_match: false,
	})

	const has_input_errors = keys_of(is_valid).some(key => !is_valid[key])
	const is_button_disabled = has_input_errors || !is_privacy_policy_confirmed

	const t_already_signed_up = translate("t.auth.pages.sign_up.already_signed_up")
	const t_email = translate("t.auth.inputs.email.label")
	const t_email_is_valid = translate("t.auth.inputs.email.is_valid")
	const t_email_placeholder = translate("t.auth.inputs.email.placeholder")
	const t_handle = translate("t.auth.inputs.handle.label")
	const t_handle_is_valid = translate("t.auth.inputs.handle.is_valid")
	const t_handle_placeholder = translate("t.auth.inputs.handle.placeholder")
	const t_privacy_policy = translate("t.auth.legal.privacy_policy.label")
	const t_privacy_policy_confirmation_text = translate("t.auth.legal.privacy_policy.consent")
	const t_pwd_capital_valid = translate("t.auth.inputs.password.has_capital_letter")
	const t_pwd_digit_valid = translate("t.auth.inputs.password.has_digit")
	const t_pwd_label = translate("t.auth.inputs.password.label")
	const t_pwd_length_is_valid = translate("t.auth.inputs.password.length_valid")
	const t_pwd_passwords_match = translate("t.auth.inputs.password.passwords_match")
	const t_pwd_repeat = translate("t.auth.inputs.password.repeat_password_label")
	const t_pwd_special_char_valid = translate("t.auth.inputs.password.has_special_char")
	const t_status_bar_title = translate("t.auth.pages.sign_up.status_bar_title")
	const t_window_title = translate("t.auth.pages.sign_up.label")

	useEffect(() => {
		commands.emit("cmd.application.set_title", {
			window_title: t_window_title,
			status_bar_title: t_status_bar_title,
		})
	}, [commands, t_window_title, t_status_bar_title])

	useEffect(() => {
		set_is_valid(p => ({ ...p, passwords_match: password === repeat_password }))
	}, [password, repeat_password])

	return (
		<div className="w-full max-w-sm">
			<section className="mx-auto w-full px-4 text-center">
				<Heading level="1" uppercase styled_first_letter>
					{t_window_title}
				</Heading>
			</section>

			<section className="mx-auto w-full px-4 py-8">
				<form className="flex w-full flex-col items-center space-y-12">
					<div className="flex w-full flex-col space-y-6">
						<fieldset className="space-y-4">
							<EmailInput
								label={t_email}
								placeholder={t_email_placeholder}
								onInput={event => {
									set_email(event.target.value)
									set_is_valid(p => ({ ...p, email: isEmail(event.target.value) }))
								}}
							/>

							<TextInput
								id="handle"
								label={t_handle}
								placeholder={t_handle_placeholder}
								onInput={event => {
									set_handle(event.target.value)
									set_is_valid(p => ({
										...p,
										handle:
											is_non_empty_string(event.target.value) &&
											// eslint-disable-next-line no-useless-escape
											!/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(event.target.value), // TODO: Replace with user validations
									}))
								}}
							/>

							<PasswordInput
								label={t_pwd_label}
								onInput={e => {
									set_password(e.target.value)
									set_is_valid(p => ({
										...p,
										length: e.target.value.length >= 8 && e.target.value.length <= 50,
										has_capital: /\p{L}/u.test(e.target.value),
										has_digit: /\d/u.test(e.target.value),
										// eslint-disable-next-line no-useless-escape
										has_symbol: /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(e.target.value), // TODO: Replace with user validations
									}))
								}}
							/>

							<PasswordInput
								id="repeat-password"
								label={t_pwd_repeat}
								onInput={e => set_repeat_password(e.target.value)}
							/>

							{(password || repeat_password) && !!handle && !!email && (
								<Callout type={has_input_errors ? "rrr" : "success"}>
									<div>
										<div className="flex items-center space-x-2">
											{is_valid.email ? (
												<BsCheck2 className="shrink-0 text-lg text-emerald-500" />
											) : (
												<BsX className="shrink-0 text-lg text-red-500" />
											)}
											<span>{t_email_is_valid}</span>
										</div>
										<div className="flex items-center space-x-2">
											{is_valid.handle ? (
												<BsCheck2 className="shrink-0 text-lg text-emerald-500" />
											) : (
												<BsX className="shrink-0 text-lg text-red-500" />
											)}
											<span>{t_handle_is_valid}</span>
										</div>
										<div className="flex items-center space-x-2">
											{is_valid.length ? (
												<BsCheck2 className="shrink-0 text-lg text-emerald-500" />
											) : (
												<BsX className="shrink-0 text-lg text-red-500" />
											)}
											<span>{t_pwd_length_is_valid}</span>
										</div>
										<div className="flex items-center space-x-2">
											{is_valid.has_capital ? (
												<BsCheck2 className="shrink-0 text-lg text-emerald-500" />
											) : (
												<BsX className="shrink-0 text-lg text-red-500" />
											)}
											<span>{t_pwd_capital_valid}</span>
										</div>
										<div className="flex items-center space-x-2">
											{is_valid.has_digit ? (
												<BsCheck2 className="shrink-0 text-lg text-emerald-500" />
											) : (
												<BsX className="shrink-0 text-lg text-red-500" />
											)}
											<span>{t_pwd_digit_valid}</span>
										</div>
										<div className="flex items-center space-x-2">
											{is_valid.has_symbol ? (
												<BsCheck2 className="shrink-0 text-lg text-emerald-500" />
											) : (
												<BsX className="shrink-0 text-lg text-red-500" />
											)}
											<span>{t_pwd_special_char_valid}</span>
										</div>
										<div className="flex items-center space-x-2">
											{is_valid.passwords_match ? (
												<BsCheck2 className="shrink-0 text-lg text-emerald-500" />
											) : (
												<BsX className="shrink-0 text-lg text-red-500" />
											)}
											<span>{t_pwd_passwords_match}</span>
										</div>
									</div>
								</Callout>
							)}
						</fieldset>
					</div>

					<p className="text-xs">
						<label className="flex cursor-pointer items-center space-x-2">
							<span className="block">
								<input
									type="checkbox"
									checked={is_privacy_policy_confirmed}
									onChange={() => set_is_privacy_policy_confirmed(v => !v)}
								/>
							</span>
							<span className="block">
								{t_privacy_policy_confirmation_text}{" "}
								<Link
									href={`/legal/${current_language}/privacy-policy`}
									target="_blank"
									rel="noreferrer"
								>
									{t_privacy_policy}
								</Link>
								.
							</span>
						</label>
					</p>

					<div className="flex w-full flex-col">
						<Button.Primary
							disabled={is_button_disabled}
							onClick={event => {
								event.preventDefault()

								if (is_button_disabled) return

								const path: Routes.ID.SignUp.Path = "/account/sign-up"
								const method: Routes.ID.SignUp.Method = "POST"
								const body: Routes.ID.SignUp.RequestBody = {
									email,
									handle: `@${handle}`,
									password,
								}

								void fetch(hosts.id.concat(path), {
									credentials: "include",
									headers: { "content-type": "application/json" },
									body: JSON.stringify(body),
									method,
								})
									.then(res => res.json())
									.then(res => {
										if (res.success) return window.location.replace("/")

										const { message, title } = Switch.Match(Number(res.error[0]))
											.case(RRR.enum.ENOENT, () => ({
												message: "t.auth.errors.sign_up.eexist" satisfies TTranslationKey,
												title: "ENOENT",
											}))
											.case(RRR.enum.EIO, () => ({
												message: "t.auth.errors.sign_up.eio" satisfies TTranslationKey,
												title: "EIO",
											}))
											.case(RRR.enum.EINVAL, () => ({
												message: "t.auth.errors.sign_up.einval" satisfies TTranslationKey,
												title: "EINVAL",
											}))
											.default(() => ({
												message: "t.auth.errors.unexpected_error" satisfies TTranslationKey,
												title: "EWTF",
											})) as { message: TTranslationKey; title: string }

										commands.emit("cmd.application.notification.show", {
											title,
											message: translate(message),
											type: "rrr",
											duration: 15,
										})
									})
							}}
						>
							{t_window_title}
						</Button.Primary>
					</div>

					<div className="flex space-x-2">
						<Link href="/auth/sign-in">{t_already_signed_up}</Link>
					</div>
				</form>
			</section>
		</div>
	)
}
