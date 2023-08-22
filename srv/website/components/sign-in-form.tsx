// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

"use client"

import { useEffect, useState } from "react"
import { Button } from "./button"
import { Callout } from "./callout"
import { EmailInput, PasswordInput } from "./input"

type Props = { workspaceHost: string; idHost: string }

export default function SignInForm({ workspaceHost, idHost }: Props) {
	const [emailErrors, setEmailErrors] = useState<string[]>([])
	const [passwordErrors, setPasswordErrors] = useState<string[]>([])

	const [errors, setErrors] = useState<string[]>([])
	const [email, setEmail] = useState<string>("")
	const [password, setPassword] = useState<string>("")

	const bannerOpacity = errors.length > 0 ? "opacity-100" : "opacity-0"
	const isButtonDisabled = !email || !password || errors.length > 0

	useEffect(() => {
		setErrors(emailErrors.concat(passwordErrors))
	}, [emailErrors, passwordErrors])

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
				</fieldset>
			</div>

			<div className="w-full flex flex-col">
				<Button
					disabled={isButtonDisabled}
					onClick={async e => {
						e.preventDefault()

						if (isButtonDisabled) return

						await fetch(`${idHost}/sign-in`, {
							credentials: "include",
							headers: { "content-type": "application/json;charset=UTF-8" },
							body: JSON.stringify({ email, password }),
							method: "POST",
						})
							.then(res => res.json())
							.then(res => {
								if (res.success) return window.location.replace(workspaceHost)
								console.log(res)
							})
					}}
				>
					Sign in
				</Button>
			</div>

			<div className="flex space-x-2">
				<a href="/sign-up">Not a member?</a>
				<div>|</div>
				<a href="/forgot-password">Forgot password?</a>
			</div>

			<div
				className={`w-full max-w-xs fixed bottom-4 transition-opacity duration-300 right-4 ${bannerOpacity}`}
			>
				<Callout type="error">{errors[0]}</Callout>
			</div>
		</form>
	)
}
