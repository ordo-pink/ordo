// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react"
import { Button } from "./button"
import { Callout } from "./callout"
import { EmailInput, PasswordInput } from "./input"
import { OrdoRoutes } from "@ordo-pink/ordo-routes"
import { BsCheck2, BsX } from "react-icons/bs"
import isEmail from "validator/lib/isEmail"
import { keysOf } from "@ordo-pink/tau"

type _P = { idHost: string; workspaceHost: string }

export default function SignUpForm({ idHost, workspaceHost }: _P) {
	const [isPrivacyPolicyConfirmed, setIsPrivacyPolicyConfirmed] = useState(false)

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [repeatPassword, setRepeatPassword] = useState("")

	const [isValid, setIsValid] = useState({
		email: false,
		passwordLength: false,
		passwordDigit: false,
		passwordCapital: false,
		passwordSymbol: false,
		passwordsMatch: false,
	})

	const isButtonDisabled =
		!email || !password || keysOf(isValid).some(key => !isValid[key]) || !isPrivacyPolicyConfirmed

	useEffect(() => {
		setIsValid(p => ({ ...p, passwordsMatch: password === repeatPassword }))
	}, [password, repeatPassword])

	return (
		<form className="flex flex-col items-center space-y-12 w-full">
			<div className="flex flex-col space-y-6 w-full">
				<fieldset className="space-y-4">
					<EmailInput
						onChange={e => {
							setEmail(e.target.value)
							setIsValid(s => ({ ...s, email: isEmail(e.target.value) }))
						}}
					/>

					<PasswordInput
						label="Пароль"
						onChange={e => {
							setPassword(e.target.value)
							setIsValid(s => ({
								...s,
								passwordLength: e.target.value.length >= 8 && e.target.value.length <= 50,
								passwordCapital: /\p{L}/u.test(e.target.value),
								passwordDigit: /\d/u.test(e.target.value),
								passwordSymbol: /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(e.target.value),
							}))
						}}
					/>

					<PasswordInput
						label="И ещё раз пароль"
						onChange={e => setRepeatPassword(e.target.value)}
					/>

					{(password || repeatPassword) && (
						<Callout type={keysOf(isValid).some(key => !isValid[key]) ? "error" : "success"}>
							<div>
								<div className="flex items-center space-x-2">
									{isValid.passwordLength ? (
										<BsCheck2 className="text-lg text-emerald-500 shrink-0" />
									) : (
										<BsX className="text-lg text-red-500 shrink-0" />
									)}
									<span>Email указан верно</span>
								</div>
								<div className="flex items-center space-x-2">
									{isValid.passwordLength ? (
										<BsCheck2 className="text-lg text-emerald-500 shrink-0" />
									) : (
										<BsX className="text-lg text-red-500 shrink-0" />
									)}
									<span>Пароль от 8 до 50 символов</span>
								</div>
								<div className="flex items-center space-x-2">
									{isValid.passwordCapital ? (
										<BsCheck2 className="text-lg text-emerald-500 shrink-0" />
									) : (
										<BsX className="text-lg text-red-500 shrink-0" />
									)}
									<span>Хотя бы одна заглавная буква в пароле</span>
								</div>
								<div className="flex items-center space-x-2">
									{isValid.passwordDigit ? (
										<BsCheck2 className="text-lg text-emerald-500 shrink-0" />
									) : (
										<BsX className="text-lg text-red-500 shrink-0" />
									)}
									<span>Хотя бы одна цифра в пароле</span>
								</div>
								<div className="flex items-center space-x-2">
									{isValid.passwordSymbol ? (
										<BsCheck2 className="text-lg text-emerald-500 shrink-0" />
									) : (
										<BsX className="text-lg text-red-500 shrink-0" />
									)}
									<span>Специальный символ ({"`!@#$%^&*()_+-=[]{};':\"\\|,.<>/?~"}) в пароле</span>
								</div>
								<div className="flex items-center space-x-2">
									{isValid.passwordsMatch ? (
										<BsCheck2 className="text-lg text-emerald-500 shrink-0" />
									) : (
										<BsX className="text-lg text-red-500 shrink-0" />
									)}
									<span>Пароли совпадают</span>
								</div>
							</div>
						</Callout>
					)}
				</fieldset>
			</div>

			<p className="text-xs">
				<label className="flex items-center space-x-2 cursor-pointer">
					<span className="block">
						<input
							type="checkbox"
							checked={isPrivacyPolicyConfirmed}
							onChange={() => setIsPrivacyPolicyConfirmed(v => !v)}
						/>
					</span>
					<span className="block">
						Нажимая на кнопку <b>&quot;Присоединиться&quot;</b>, вы соглашаетесь с нашей{" "}
						<a href={privacyPolicyURL} target="_blank">
							политикой конфиденциальности
						</a>
						.
					</span>
				</label>
			</p>

			<div className="flex flex-col w-full">
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
				<a href={signInURL}>Уже зарегистрированы?</a>
			</div>
		</form>
	)
}

// --- Internal ---

const signInURL = OrdoRoutes.Website.SignIn.prepareRequest({ host: "" }).url
const privacyPolicyURL = OrdoRoutes.Website.PrivacyPolicy.prepareRequest({ host: "" }).url
