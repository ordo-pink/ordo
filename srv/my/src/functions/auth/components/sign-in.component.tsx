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

	const translate = use$.scoped_translation("pink.ordo.auth")

	const t_title = translate("sign_in_title")
	const t_hint = translate("sign_in_hint")

	const [email, set_email] = useState("")
	const [password, set_password] = useState("")

	useEffect(() => {
		commands.emit<cmd.application.set_title>("application.set_title", {
			window_title: t_title,
			status_bar_title: t_hint,
		})
	}, [commands, t_title, t_hint])

	return (
		<div className="w-full max-w-sm">
			<section className="mx-auto w-full px-4 text-center">
				<Heading level="1" uppercase styled_first_letter>
					{t_title}
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
