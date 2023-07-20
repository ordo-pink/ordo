import { useSignal } from "@preact/signals"
import { Button } from "../components/button.tsx"
import { Callout } from "../components/callout.tsx"
import { EmailInput, PasswordInput } from "../components/input.tsx"
import { useEffect, useState } from "preact/hooks"
import { isSignedIn, signIn } from "../streams/auth.ts"

export default function SignUpForm() {
	const [emailErrors, setEmailErrors] = useState<string[]>([])
	const [passwordErrors, setPasswordErrors] = useState<string[]>([])

	if (isSignedIn()) {
		window.location.href = "/"
	}

	const errors = useSignal<string[]>([])
	const email = useSignal("")
	const password = useSignal("")
	const repeatPassword = useSignal("")

	const bannerOpacity = errors.value.length > 0 ? "opacity-100" : "opacity-0"
	const isButtonDisabled =
		!Boolean(email.value) || !Boolean(password.value) || errors.value.length > 0

	useEffect(() => {
		errors.value = emailErrors.concat(passwordErrors)
	}, [emailErrors, passwordErrors])

	useEffect(() => {
		password.subscribe(value => {
			if (value !== repeatPassword.value) {
				errors.value = errors.value.concat("Passwords must match.")
			}
		})
	}, [password, repeatPassword])

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
								setPasswordErrors(
									repeatPassword.value && repeatPassword.value !== v
										? ["Passwords must match."]
										: []
								)
							})
						}
					/>

					<PasswordInput
						label="Repeat password"
						onChange={e =>
							e.fold(setPasswordErrors, v => {
								repeatPassword.value = v
								setPasswordErrors(
									password.value && password.value !== v
										? ["Passwords must match."]
										: []
								)
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

						const response = await fetch("http://localhost:3001/sign-up", {
							body: JSON.stringify({
								email: email.value,
								password: password.value,
							}),
							method: "POST",
						}).then(res => res.json())

						signIn(response)

						window.location
					}}
				>
					Sign up
				</Button>
			</div>

			<div class="flex space-x-2">
				<a href="/sign-in">Already a member?</a>
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
