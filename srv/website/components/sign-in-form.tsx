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

"use client"

import { useState } from "react"

import { OrdoRoutes } from "@ordo-pink/ordo-routes"

import { EmailInput, PasswordInput } from "./input"
import { Button } from "./button"

type Props = { workspaceHost: string; idHost: string }

export default function SignInForm({ workspaceHost, idHost }: Props) {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	return (
		<form className="flex w-full flex-col items-center space-y-12">
			<div className="flex w-full flex-col space-y-6">
				<fieldset className="space-y-4">
					<EmailInput onChange={e => setEmail(e.target.value)} />
					<PasswordInput label="Пароль" onChange={e => setPassword(e.target.value)} />
				</fieldset>
			</div>

			<div className="flex w-full flex-col">
				<Button
					onClick={e => {
						e.preventDefault()

						void fetch(`${idHost}/sign-in`, {
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
