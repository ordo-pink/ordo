import { useEffect } from "react"

import { useCommands, useRouteParams } from "@ordo-pink/frontend-react-hooks"
import { Oath } from "@ordo-pink/oath"
import { Switch } from "@ordo-pink/switch"

import Loading from "@ordo-pink/frontend-react-components/loading-page"

import SignIn from "../components/sign-in.component"
import SignUp from "../components/sign-up.component"

export default function Auth() {
	const commands = useCommands()

	const { action } = useRouteParams<{ action: TAction }>()

	useEffect(() => {
		void Oath.FromNullable(action)
			.pipe(
				Oath.ops.chain(action =>
					Oath.If(SUPPORTED_ACTIONS.includes(action), {
						F: () => commands.emit("auth.open-sign-in"),
					}),
				),
			)
			.invoke(Oath.invokers.or_nothing)
	}, [action, commands])

	const Component = Switch.Match(action)
		.case("sign-in", () => SignIn)
		.case("sign-up", () => SignUp)
		.case("sign-out", () => Loading)
		.default(() => Loading)

	return (
		<div className="flex h-dvh flex-col items-center justify-center">
			<Component />
		</div>
	)
}

// --- Internal ---

const SUPPORTED_ACTIONS = ["sign-up", "sign-in", "sign-out"] as const

type TAction = (typeof SUPPORTED_ACTIONS)[number]
