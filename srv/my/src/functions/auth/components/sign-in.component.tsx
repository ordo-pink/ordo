import { useEffect } from "react"

import { useCommands } from "@ordo-pink/frontend-react-hooks"

import Heading from "@ordo-pink/frontend-react-components/heading"

export default function SignIn() {
	const commands = useCommands()

	const t_title = "auth.sign-in.sign-in"
	const t_hint = "auth.sign-in.hint"

	useEffect(() => {
		commands.emit<cmd.application.set_title>("application.set_title", {
			window_title: t_title,
			status_bar_title: t_hint,
		})
	}, [commands])

	return (
		<div className="w-full max-w-sm">
			<section className="mx-auto w-full px-4 text-center">
				<Heading level="1" uppercase styled_first_letter>
					{t_title}
				</Heading>
			</section>

			<section className="mx-auto w-full px-4 py-8"></section>
		</div>
	)
}
