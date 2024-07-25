import { BsCheck2, BsX } from "react-icons/bs"
import { useEffect, useState } from "react"
import { isEmail } from "validator"

import { EmailInput, PasswordInput, TextInput } from "@ordo-pink/frontend-react-components/input"
import { is_non_empty_string, keys_of } from "@ordo-pink/tau"
import { useCommands, useHosts } from "@ordo-pink/frontend-react-hooks"
import { OrdoRoutes } from "@ordo-pink/ordo-routes"

import Button from "@ordo-pink/frontend-react-components/button"
import Callout from "@ordo-pink/frontend-react-components/callout"
import Heading from "@ordo-pink/frontend-react-components/heading"
import Link from "@ordo-pink/frontend-react-components/link"
import Null from "@ordo-pink/frontend-react-components/null"

export default function SignUp() {
	const commands = useCommands()
	const hosts_result = useHosts()

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

	const is_button_disabled =
		!email ||
		!password ||
		keys_of(is_valid).some(key => !is_valid[key]) ||
		!is_privacy_policy_confirmed

	useEffect(() => {
		commands.emit<cmd.application.set_title>("application.set_title", {
			window_title: t_title,
			status_bar_title: t_hint,
		})
	}, [commands])

	useEffect(() => {
		set_is_valid(p => ({ ...p, passwords_match: password === repeat_password }))
	}, [password, repeat_password])

	const t_title = "auth.sign-up.sign-up"
	const t_hint = "auth.sign-up.hint"

	return hosts_result.cata({
		Err: Null, // TODO: Show permission error
		Ok: hosts => (
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
									onInput={e => {
										set_email(e.target.value)
										set_is_valid(s => ({ ...s, email: isEmail(e.target.value) }))
									}}
								/>

								<TextInput
									id="handle"
									label="Имя пользователя"
									placeholder="ordo"
									onInput={event => {
										set_handle(event.target.value)
										set_is_valid(s => ({
											...s,
											handle:
												is_non_empty_string(event.target.value) &&
												// eslint-disable-next-line no-useless-escape
												!/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(event.target.value),
										}))
									}}
								/>

								<PasswordInput
									label="Пароль"
									onInput={e => {
										set_password(e.target.value)
										set_is_valid(s => ({
											...s,
											length: e.target.value.length >= 8 && e.target.value.length <= 50,
											has_capital: /\p{L}/u.test(e.target.value),
											has_digit: /\d/u.test(e.target.value),
											// eslint-disable-next-line no-useless-escape
											has_symbol: /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(e.target.value),
										}))
									}}
								/>

								<PasswordInput
									id="repeat-password"
									label="И ещё раз пароль"
									onInput={e => set_repeat_password(e.target.value)}
								/>

								{(password || repeat_password) && !!handle && !!email && (
									<Callout type={keys_of(is_valid).some(key => !is_valid[key]) ? "rrr" : "success"}>
										<div>
											<div className="flex items-center space-x-2">
												{is_valid.email ? (
													<BsCheck2 className="shrink-0 text-lg text-emerald-500" />
												) : (
													<BsX className="shrink-0 text-lg text-red-500" />
												)}
												<span>Email указан верно</span>
											</div>
											<div className="flex items-center space-x-2">
												{is_valid.handle ? (
													<BsCheck2 className="shrink-0 text-lg text-emerald-500" />
												) : (
													<BsX className="shrink-0 text-lg text-red-500" />
												)}
												<span>Имя пользователя указано</span>
											</div>
											<div className="flex items-center space-x-2">
												{is_valid.length ? (
													<BsCheck2 className="shrink-0 text-lg text-emerald-500" />
												) : (
													<BsX className="shrink-0 text-lg text-red-500" />
												)}
												<span>Пароль от 8 до 50 символов</span>
											</div>
											<div className="flex items-center space-x-2">
												{is_valid.has_capital ? (
													<BsCheck2 className="shrink-0 text-lg text-emerald-500" />
												) : (
													<BsX className="shrink-0 text-lg text-red-500" />
												)}
												<span>Хотя бы одна заглавная буква в пароле</span>
											</div>
											<div className="flex items-center space-x-2">
												{is_valid.has_digit ? (
													<BsCheck2 className="shrink-0 text-lg text-emerald-500" />
												) : (
													<BsX className="shrink-0 text-lg text-red-500" />
												)}
												<span>Хотя бы одна цифра в пароле</span>
											</div>
											<div className="flex items-center space-x-2">
												{is_valid.has_symbol ? (
													<BsCheck2 className="shrink-0 text-lg text-emerald-500" />
												) : (
													<BsX className="shrink-0 text-lg text-red-500" />
												)}
												<span>
													Специальный символ ({"`!@#$%^&*()_+-=[]{};':\"\\|,.<>/?~"}) в пароле
												</span>
											</div>
											<div className="flex items-center space-x-2">
												{is_valid.passwords_match ? (
													<BsCheck2 className="shrink-0 text-lg text-emerald-500" />
												) : (
													<BsX className="shrink-0 text-lg text-red-500" />
												)}
												<span>Пароли совпадают</span>
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
									Нажимая на кнопку <b>&quot;Присоединиться&quot;</b>, вы соглашаетесь с нашей{" "}
									<Link
										href={privacyPolicyURL}
										target="_blank"
										rel="noreferrer"
										commands={commands}
									>
										политикой конфиденциальности
									</Link>
									.
								</span>
							</label>
						</p>

						<div className="flex w-full flex-col">
							<Button.Primary
								disabled={is_button_disabled}
								onClick={e => {
									e.preventDefault()

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
										.then(() => window.location.replace(hosts.my))
								}}
							>
								Присоединиться
							</Button.Primary>
						</div>

						<div className="flex space-x-2">
							<Link href="/auth/sign-in" commands={commands}>
								Уже зарегистрированы?
							</Link>
						</div>
					</form>
				</section>
			</div>
		),
	})
}

const privacyPolicyURL = OrdoRoutes.Website.PrivacyPolicy.prepareRequest({ host: "" }).url
