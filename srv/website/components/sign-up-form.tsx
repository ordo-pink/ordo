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
import isEmail from "validator/lib/isEmail"

import { OrdoRoutes } from "@ordo-pink/ordo-routes"
import { keys_of } from "@ordo-pink/tau"

import { EmailInput, PasswordInput } from "./input"
import { Button } from "./button"
import { Callout } from "./callout"

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
		!email || !password || keys_of(isValid).some(key => !isValid[key]) || !isPrivacyPolicyConfirmed

	useEffect(() => {
		setIsValid(p => ({ ...p, passwordsMatch: password === repeatPassword }))
	}, [password, repeatPassword])

	return (
		<form className="flex w-full flex-col items-center space-y-12">
			<div className="flex w-full flex-col space-y-6">
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
								// eslint-disable-next-line no-useless-escape
								passwordSymbol: /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(e.target.value),
							}))
						}}
					/>

					<PasswordInput
						label="И ещё раз пароль"
						onChange={e => setRepeatPassword(e.target.value)}
					/>

					{(password || repeatPassword) && (
						<Callout type={keys_of(isValid).some(key => !isValid[key]) ? "error" : "success"}>
							<div>
								<div className="flex items-center space-x-2">
									{isValid.passwordLength ? (
										<BsCheck2 className="shrink-0 text-lg text-emerald-500" />
									) : (
										<BsX className="shrink-0 text-lg text-red-500" />
									)}
									<span>Email указан верно</span>
								</div>
								<div className="flex items-center space-x-2">
									{isValid.passwordLength ? (
										<BsCheck2 className="shrink-0 text-lg text-emerald-500" />
									) : (
										<BsX className="shrink-0 text-lg text-red-500" />
									)}
									<span>Пароль от 8 до 50 символов</span>
								</div>
								<div className="flex items-center space-x-2">
									{isValid.passwordCapital ? (
										<BsCheck2 className="shrink-0 text-lg text-emerald-500" />
									) : (
										<BsX className="shrink-0 text-lg text-red-500" />
									)}
									<span>Хотя бы одна заглавная буква в пароле</span>
								</div>
								<div className="flex items-center space-x-2">
									{isValid.passwordDigit ? (
										<BsCheck2 className="shrink-0 text-lg text-emerald-500" />
									) : (
										<BsX className="shrink-0 text-lg text-red-500" />
									)}
									<span>Хотя бы одна цифра в пароле</span>
								</div>
								<div className="flex items-center space-x-2">
									{isValid.passwordSymbol ? (
										<BsCheck2 className="shrink-0 text-lg text-emerald-500" />
									) : (
										<BsX className="shrink-0 text-lg text-red-500" />
									)}
									<span>Специальный символ ({"`!@#$%^&*()_+-=[]{};':\"\\|,.<>/?~"}) в пароле</span>
								</div>
								<div className="flex items-center space-x-2">
									{isValid.passwordsMatch ? (
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
							checked={isPrivacyPolicyConfirmed}
							onChange={() => setIsPrivacyPolicyConfirmed(v => !v)}
						/>
					</span>
					<span className="block">
						Нажимая на кнопку <b>&quot;Присоединиться&quot;</b>, вы соглашаетесь с нашей{" "}
						<a href={privacyPolicyURL} target="_blank" rel="noreferrer">
							политикой конфиденциальности
						</a>
						.
					</span>
				</label>
			</p>

			<div className="flex w-full flex-col">
				<Button
					disabled={isButtonDisabled}
					onClick={e => {
						e.preventDefault()

						if (isButtonDisabled) return

						void fetch(`${idHost}/sign-up`, {
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
