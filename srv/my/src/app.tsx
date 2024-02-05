import CenteredPage from "@ordo-pink/frontend-react-components/centered-page"
import Heading from "@ordo-pink/frontend-react-components/heading"
import OrdoButton from "@ordo-pink/frontend-react-components/button"
import { useIsAuthenticated } from "@ordo-pink/frontend-stream-user"
import { useEffect } from "react"
import { useCommands } from "@ordo-pink/frontend-stream-commands"
import { useUser } from "@ordo-pink/frontend-stream-user/src/frontend-stream-user.impl"
import { Oath } from "@ordo-pink/oath"
import Null from "@ordo-pink/frontend-react-components/null"
import { Either } from "@ordo-pink/either"
import { useLogger } from "@ordo-pink/frontend-logger"

export default function App() {
	const commands = useCommands()
	const isAuthenticated = useIsAuthenticated()
	const user = useUser()
	const logger = useLogger()

	useEffect(() => {
		Either.fromBoolean(() => isAuthenticated).fold(Null, () =>
			commands.emit<cmd.user.refreshInfo>("user.refresh"),
		)
	}, [isAuthenticated])

	useEffect(() => {
		Oath.fromNullable(user)
			// TODO: Move functions to user object
			// TODO: Take import source from ENV
			.chain(() => Oath.from(() => import("@ordo-pink/function-test")))
			.chain(f => Oath.from(async () => f.default))
			.map(() => commands.emit("hello.world"))
			.orNothing()
	}, [user])

	return (
		<CenteredPage centerX centerY>
			<Heading level="2" styledFirstLetter>
				Vite + React
			</Heading>
			<div>
				<OrdoButton.Primary onClick={() => logger.notice("HEY")}>Hey</OrdoButton.Primary>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p>Click on the {String(import.meta.env.VITE_ORDO_DT_HOST)} and React logos to learn more</p>
		</CenteredPage>
	)
}
