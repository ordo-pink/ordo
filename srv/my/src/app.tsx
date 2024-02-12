import { ErrorInfo, useEffect } from "react"
import Helmet from "react-helmet"

import {
	useCommands,
	useLogger,
	useStrictSubscription,
	useSubscription,
} from "@ordo-pink/frontend-react-hooks"
import { Either } from "@ordo-pink/either"
import { Oath } from "@ordo-pink/oath"
import { currentActivity$ } from "@ordo-pink/frontend-stream-activities"
import { useAppInit } from "@ordo-pink/frontend-app-init"

import ActivityBar from "@ordo-pink/frontend-react-sections/activity-bar"
import BackgroundTaskIndicator from "@ordo-pink/frontend-react-sections/background-task-indicator"
import ContextMenu from "@ordo-pink/frontend-react-sections/context-menu/context-menu.component"
import ErrorBoundary from "@ordo-pink/frontend-react-components/error-boundary"
import Loading from "@ordo-pink/frontend-react-components/loading-page"
import Modal from "@ordo-pink/frontend-react-sections/modal"
import Notifications from "@ordo-pink/frontend-react-sections/notifications"
import Workspace from "@ordo-pink/frontend-react-sections/workspace"
import { title$ } from "@ordo-pink/frontend-stream-title"

// TODO: Take import source from ENV
export default function App() {
	const commands = useCommands()
	const currentActivity = useSubscription(currentActivity$)
	const logger = useLogger()

	const title = useStrictSubscription(title$, "Ordo.pink")

	useAppInit()

	const logError = (error: Error, info: ErrorInfo) => {
		logger.error(error)
		logger.error(info.componentStack)
	}

	useEffect(() => {
		void Oath.of(commands)
			.chain(() =>
				Oath.from(() => import("@ordo-pink/function-home")).chain(f =>
					Oath.from(async () => await f.default),
				),
			)
			.chain(() =>
				Oath.from(() => import("@ordo-pink/function-file-explorer")).chain(f =>
					Oath.from(async () => await f.default),
				),
			)
			.chain(() =>
				Oath.from(() => import("@ordo-pink/function-gtd")).chain(f =>
					Oath.from(async () => await f.default),
				),
			)
			.chain(() =>
				Oath.from(() => import("@ordo-pink/function-links")).chain(f =>
					Oath.from(async () => await f.default),
				),
			)
			.chain(() =>
				Oath.from(() => import("@ordo-pink/function-user")).chain(f =>
					Oath.from(async () => await f.default),
				),
			)
			.orNothing()

		return () => {
			commands.emit<cmd.commandPalette.remove>("command-palette.remove", "command-palette.hide")
		}
	}, [commands])

	return Either.fromNullable(currentActivity).fold(Loading, () => (
		<ErrorBoundary logError={logError} fallback={<Fallback />}>
			<Helmet>
				<title>{title}</title>
			</Helmet>

			<div className="flex">
				<ActivityBar />
				<Workspace />
			</div>

			<Notifications />
			<ContextMenu />
			<BackgroundTaskIndicator />
			<Modal />
		</ErrorBoundary>
	))
}

// --- Internal ---

const Fallback = () => <div>TODO</div> // TODO: Add error fallback
