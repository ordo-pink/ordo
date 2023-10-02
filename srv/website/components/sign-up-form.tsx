// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react"
import { Button } from "./button"
import { Callout } from "./callout"
import { EmailInput, PasswordInput } from "./input"

type _P = { idHost: string; workspaceHost: string }

export default function SignUpForm({ idHost, workspaceHost }: _P) {
	const [emailErrors, setEmailErrors] = useState<string[]>([])
	const [passwordErrors, setPasswordErrors] = useState<string[]>([])

	const [errors, setErrors] = useState<string[]>([])
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [repeatPassword, setRepeatPassword] = useState("")

	const bannerOpacity = errors.length > 0 ? "opacity-100" : "opacity-0"
	const isButtonDisabled = !email || !password || errors.length > 0

	useEffect(() => {
		setErrors(emailErrors.concat(passwordErrors))
	}, [emailErrors, passwordErrors])

	useEffect(() => {
		if (password && repeatPassword && password !== repeatPassword) {
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
						onInput={e =>
							e.fork(setPasswordErrors, v => {
								setPassword(v)
								setPasswordErrors([])
							})
						}
					/>

					<PasswordInput
						label="Repeat password"
						onInput={e =>
							e.fork(setPasswordErrors, v => {
								setPassword(v)
								setPasswordErrors([])
							})
						}
					/>
				</fieldset>
			</div>

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
					Sign up
				</Button>
			</div>

			<div className="flex space-x-2">
				<a href="/sign-in">Already a member?</a>
			</div>

			<div
				className={`w-full max-w-xs fixed bottom-4 transition-opacity duration-300 right-4 ${bannerOpacity}`}
			>
				<Callout type="error">{errors[0]}</Callout>
			</div>
		</form>
	)
}
