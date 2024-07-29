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

/**
 * TODO: Replace validations with user validations
 */
export default function SignUp() {
	const commands = use$.commands()
	const hosts = use$.hosts()
	const translate = use$.scoped_translation("pink.ordo.auth")
	const translate_common = use$.scoped_translation("common")
	const current_language = use$.current_language()
	const fetch = use$.fetch()

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

	const t_email = translate_common("email")
	const t_handle = translate_common("handle")
	const t_password = translate_common("password")
	const t_repeat_password = translate_common("repeat_password")
	const t_privacy_policy = translate_common("privacy_policy")
	const t_title = translate("sign_up_title")
	const t_hint = translate("sign_up_hint")
	const t_email_placeholder = translate("email_placeholder")
	const t_handle_placeholder = translate("handle_placeholder")
	const t_already_signed_up = translate("already_signed_up")
	const t_privacy_policy_confirmation_text = translate("privacy_policy_confirm_lbl")
	const t_pwd_capital_valid = translate("password_has_capital")
	const t_pwd_digit_valid = translate("password_has_digit")
	const t_pwd_length_is_valid = translate("password_length_valid")
	const t_pwd_passwords_match = translate("passwords_match")
	const t_pwd_special_char_valid = translate("password_has_special_char")
	const t_handle_is_valid = translate("handle_is_valid")
	const t_email_is_valid = translate("email_is_valid")

	console.log(is_valid)

	useEffect(() => {
		commands.emit<cmd.application.set_title>("application.set_title", {
			window_title: t_title,
			status_bar_title: t_hint,
		})
	}, [commands, t_title, t_hint])

	useEffect(() => {
		set_is_valid(p => ({ ...p, passwords_match: password === repeat_password }))
	}, [password, repeat_password])

	return (
		<div className="w-full max-w-sm">
			<section className="mx-auto w-full px-4 text-center">
				<Heading level="1" uppercase styled_first_letter>
					{t_title}
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
								label={t_password}
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
								label={t_repeat_password}
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
									.then(() => window.location.replace("/"))
							}}
						>
							{t_title}
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
