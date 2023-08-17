// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { useSignal } from "@preact/signals"
import { useEffect, useState } from "preact/hooks"
import { Button } from "../../components/button.tsx"
import { Callout } from "../../components/callout.tsx"
import { EmailInput, PasswordInput } from "../../components/input.tsx"

type Props = { host: string }

export default function SignInForm({ host }: Props) {
	const [emailErrors, setEmailErrors] = useState<string[]>([])
	const [passwordErrors, setPasswordErrors] = useState<string[]>([])

	const errors = useSignal<string[]>([])
	const email = useSignal<string>("")
	const password = useSignal<string>("")

	const bannerOpacity = errors.value.length > 0 ? "opacity-100" : "opacity-0"
	const isButtonDisabled = !email.value || !password.value || errors.value.length > 0

	useEffect(() => {
		errors.value = emailErrors.concat(passwordErrors)
	}, [emailErrors, passwordErrors])

	return (
		<form class="w-full flex flex-col items-center space-y-12">
			<div class="w-full flex flex-col space-y-6">
				<fieldset class="space-y-4">
					<EmailInput
						onChange={e =>
							e.fold(setEmailErrors, v => {
								email.value = v
								setEmailErrors([])
							})
						}
					/>
					<PasswordInput
						onChange={e =>
							e.fold(setPasswordErrors, v => {
								password.value = v
								setPasswordErrors([])
							})
						}
					/>
				</fieldset>
			</div>

			<div class="w-full flex flex-col">
				<Button
					disabled={isButtonDisabled}
					onClick={async e => {
						e.preventDefault()

						if (isButtonDisabled) return

						await fetch("http://localhost:3001/sign-in", {
							credentials: "include",
							body: JSON.stringify({
								email: email.value,
								password: password.value,
							}),
							method: "POST",
						})
							.then(res => res.json())
							.then(() => window.location.replace(host))
					}}
				>
					Sign in
				</Button>
			</div>

			<div class="flex space-x-2">
				<a href="/sign-up">Not a member?</a>
				<div>|</div>
				<a href="/forgot-password">Forgot password?</a>
			</div>

			<div
				class={`w-full max-w-xs fixed bottom-4 transition-opacity duration-300 right-4 ${bannerOpacity}`}
			>
				<Callout type="error">{errors.value[0]}</Callout>
			</div>
		</form>
	)
}
