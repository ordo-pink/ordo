// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react"
import { Button } from "./button"
import { Callout } from "./callout"
import { EmailInput, PasswordInput } from "./input"
import Link from "next/link"

type _P = { idHost: string; workspaceHost: string }

export default function SignUpForm({ idHost, workspaceHost }: _P) {
	const [emailErrors, setEmailErrors] = useState<string[]>([])
	const [passwordErrors, setPasswordErrors] = useState<string[]>([])
	const [isPrivacyPolicyConfirmed, setIsPrivacyPolicyConfirmed] = useState(false)

	const [errors, setErrors] = useState<string[]>([])
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [repeatPassword, setRepeatPassword] = useState("")

	const bannerOpacity = errors.length > 0 ? "opacity-100" : "opacity-0"
	const isButtonDisabled = !email || !password || errors.length > 0 || !isPrivacyPolicyConfirmed

	useEffect(() => {
		setErrors(emailErrors.concat(passwordErrors))
	}, [emailErrors, passwordErrors])

	useEffect(() => {
		if ((password || repeatPassword) && password !== repeatPassword) {
			setErrors(errors.concat("Passwords must match."))
		}
	}, [errors, password, repeatPassword])

	return (
		<form className="w-full flex flex-col items-center space-y-12">
			<div className="w-full flex flex-col space-y-6">
				<fieldset className="space-y-4">
					<EmailInput
						onInput={e =>
							e.fork(setEmailErrors, v => {
								setEmail(v)
								setEmailErrors([])
							})
						}
					/>

					<PasswordInput
						label="Пароль"
						onInput={e =>
							e.fork(setPasswordErrors, v => {
								setPassword(v)
								setPasswordErrors([])
							})
						}
					/>

					<PasswordInput
						label="И ещё раз пароль"
						onInput={e =>
							e.fork(setPasswordErrors, v => {
								setRepeatPassword(v)
								setPasswordErrors([])
							})
						}
					/>
				</fieldset>
			</div>

			<p className="text-xs">
				<label className="flex space-x-2 items-center cursor-pointer">
					<span className="block">
						<input
							type="checkbox"
							checked={isPrivacyPolicyConfirmed}
							onChange={() => setIsPrivacyPolicyConfirmed(v => !v)}
						/>
					</span>
					<span className="block">
						Нажимая на кнопку <b>&quot;Присоединиться&quot;</b>, вы соглашаетесь с нашей{" "}
						<Link href="/privacy-policy" target="_blank">
							политикой конфиденциальности
						</Link>
						.
					</span>
				</label>
			</p>

			<div className="w-full flex flex-col">
				<Button
					disabled={isButtonDisabled}
					onClick={async e => {
						e.preventDefault()

						if (isButtonDisabled) return

						await fetch(`${idHost}/sign-up`, {
							credentials: "include",
							headers: { "content-type": "application/json" },
							body: JSON.stringify({
								email: email,
								password: password,
							}),
							method: "POST",
						}).then(res => res.json())

						window.location.replace(workspaceHost)
					}}
				>
					Присоединиться
				</Button>
			</div>

			<div className="flex space-x-2">
				<Link href="/sign-in">Уже зарегистрированы?</Link>
			</div>

			<div
				className={`w-full max-w-xs fixed bottom-4 transition-opacity duration-300 right-4 ${bannerOpacity}`}
			>
				<Callout type="error">{errors[0]}</Callout>
			</div>
		</form>
	)
}
