// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

"use client"

import { useEffect, useState } from "react"
import { Button } from "./button"
import { Callout } from "./callout"
import { EmailInput, PasswordInput } from "./input"
import { OrdoRoutes } from "@ordo-pink/ordo-routes"

type Props = { workspaceHost: string; idHost: string }

export default function SignInForm({ workspaceHost, idHost }: Props) {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	return (
		<form className="flex flex-col items-center space-y-12 w-full">
			<div className="flex flex-col space-y-6 w-full">
				<fieldset className="space-y-4">
					<EmailInput onChange={e => setEmail(e.target.value)} />
					<PasswordInput label="Пароль" onChange={e => setPassword(e.target.value)} />
				</fieldset>
			</div>

			<div className="flex flex-col w-full">
				<Button
					onClick={async e => {
						e.preventDefault()

						await fetch(`${idHost}/sign-in`, {
							credentials: "include",
							headers: { "content-type": "application/json;charset=UTF-8" },
							body: JSON.stringify({ email, password }),
							method: "POST",
						})
							.then(res => res.json())
							.then(res => {
								if (res.success) return window.location.replace(workspaceHost)
							})
					}}
				>
					Войти
				</Button>
			</div>

			<div className="flex space-x-2">
				<a href={signUpURL}>Ещё не регистрировались?</a>
				<div>|</div>
				<a href={forgotPasswordURL}>Забыли пароль?</a>
			</div>
		</form>
	)
}

// --- Internal ---

const forgotPasswordURL = OrdoRoutes.Website.ForgotPassword.prepareRequest({ host: "" }).url
const signUpURL = OrdoRoutes.Website.SignUp.prepareRequest({ host: "" }).url
