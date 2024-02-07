import { ErrorInfo, useEffect } from "react"

import {
	useCommands,
	useIsAuthenticated,
	useLogger,
	useSubscription,
} from "@ordo-pink/frontend-react-hooks"
import { Either } from "@ordo-pink/either"
import { Oath } from "@ordo-pink/oath"
import { currentActivity$ } from "@ordo-pink/frontend-stream-activities"

import ActivityBar from "@ordo-pink/frontend-react-sections/activity-bar"
import BackgroundTaskIndicator from "@ordo-pink/frontend-react-sections/background-task-indicator"
import ErrorBoundary from "@ordo-pink/frontend-react-components/error-boundary"
import Loading from "@ordo-pink/frontend-react-components/loading-page"
import Notifications from "@ordo-pink/frontend-react-sections/notifications"
import Null from "@ordo-pink/frontend-react-components/null"
import Workspace from "@ordo-pink/frontend-react-sections/workspace"

import "./app.css"
import ContextMenu from "@ordo-pink/frontend-react-sections/context-menu/context-menu.component"

// TODO: Take import source from ENV
export default function App() {
	const commands = useCommands()
	const isAuthenticated = useIsAuthenticated()
	const currentActivity = useSubscription(currentActivity$)
	const logger = useLogger()

	const logError = (error: Error, info: ErrorInfo) => {
		logger.error(error)
		logger.error(info.componentStack)
	}

	useEffect(() => {
		Either.fromBoolean(() => isAuthenticated).fold(Null, () =>
			commands.emit<cmd.user.refreshInfo>("user.refresh"),
		)
	}, [isAuthenticated, commands])

	useEffect(() => {
		// TODO: Move functions to user object
		void Oath.of(commands)
			.chain(() => Oath.from(() => import("@ordo-pink/function-test")))
			.chain(f => Oath.from(async () => f.default))
			.orNothing()
	}, [commands])

	// TODO: Next up :: notifications, command palette, context menu
	// TODO: Next up :: update permissions
	return Either.fromNullable(currentActivity).fold(Loading, () => (
		<ErrorBoundary logError={logError} fallback={<Fallback />}>
			<div className="app">
				<ActivityBar />
				<Workspace />
			</div>

			<Notifications />
			<ContextMenu />
			<BackgroundTaskIndicator />
		</ErrorBoundary>
	))
}

// --- Internal ---

const Fallback = () => <div>TODO</div> // TODO: Add error fallback
