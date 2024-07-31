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

import { useEffect, useState } from "react"

import { EmailInput, PasswordInput } from "@ordo-pink/frontend-react-components/input"
import { use$ } from "@ordo-pink/frontend-react-hooks"

import Button from "@ordo-pink/frontend-react-components/button"
import Heading from "@ordo-pink/frontend-react-components/heading"
import Link from "@ordo-pink/frontend-react-components/link"

export default function SignIn() {
	const commands = use$.commands()
	const hosts = use$.hosts()
	const fetch = use$.fetch()

	const translate = use$.translation()

	const t_window_title = translate("t.auth.pages.sign_in.label")
	const t_status_bar_title = translate("t.auth.pages.sign_in.status_bar_title")

	const [email, set_email] = useState("")
	const [password, set_password] = useState("")

	useEffect(() => {
		commands.emit("cmd.application.set_title", {
			window_title: t_window_title,
			status_bar_title: t_status_bar_title,
		})
	}, [commands, t_window_title, t_status_bar_title])

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
							<EmailInput onInput={event => set_email(event.target.value)} />
							<PasswordInput label="Пароль" onInput={event => set_password(event.target.value)} />
						</fieldset>
					</div>

					<div className="flex w-full flex-col">
						<Button.Primary
							onClick={event => {
								event.preventDefault()

								const path: Routes.ID.SignIn.Path = "/account/sign-in"
								const method: Routes.ID.SignIn.Method = "POST"
								const body: Routes.ID.SignIn.RequestBody = { email, password }

								void fetch(`${hosts.id}${path}`, {
									credentials: "include",
									headers: { "content-type": "application/json;charset=UTF-8" },
									body: JSON.stringify(body),
									method,
								})
									.then(res => res.json())
									.then(res => {
										if (res.success) window.location.replace("/")
										// TODO: Show sign in error
									})
							}}
						>
							Войти
						</Button.Primary>
					</div>

					<div className="flex space-x-2">
						<Link href="/auth/sign-up">Ещё не регистрировались?</Link>
						{/* <div>|</div>
						<Link href={forgotPasswordURL}>Забыли пароль?</Link> */}
					</div>
				</form>
			</section>
		</div>
	)
}
