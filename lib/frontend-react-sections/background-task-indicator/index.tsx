import { AiOutlineLoading3Quarters, AiOutlineSave } from "react-icons/ai"
import { BehaviorSubject } from "rxjs"
import { useEffect } from "react"

import { useCommands, useStrictSubscription } from "@ordo-pink/frontend-react-hooks"
import { BackgroundTaskStatus } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"

import Null from "@ordo-pink/frontend-react-components/null"

/**
 * Shows a small icon in the top right corner of the screen when something is going on. Appears on
 * setting background task status to something other than 0 (`BackgroundTask.Status.NONE`). Status
 * can be changed with the `background-task.set-status` command.
 *
 * NOTE: You probably won't ever need that command as it is intended to be used automatically when
 * fetch is called.
 *
 * @commands
 * - `background-task.set-status`
 * - `background-task.reset-status`
 */
export default function BackgroundTaskIndicator() {
	const status = useStrictSubscription(backgroundTaskIndicatorStatus$, BackgroundTaskStatus.NONE)
	const commands = useCommands()

	useEffect(() => {
		commands.on<cmd.background.setStatus>("background-task.set-status", handleSetStatus)
		commands.on<cmd.background.resetStatus>("background-task.reset-status", handleResetStatus)
		commands.on<cmd.background.startLoading>("background-task.start-loading", handleLoading)
		commands.on<cmd.background.startSaving>("background-task.start-saving", handleSaving)

		return () => {
			commands.off<cmd.background.setStatus>("background-task.set-status", handleSetStatus)
			commands.off<cmd.background.resetStatus>("background-task.reset-status", handleResetStatus)
			commands.off<cmd.background.startLoading>("background-task.start-loading", handleLoading)
			commands.off<cmd.background.startSaving>("background-task.start-saving", handleSaving)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return Switch.of(status)
		.case(BackgroundTaskStatus.SAVING, SavingIndicator)
		.case(BackgroundTaskStatus.LOADING, LoadingIndicator)
		.default(Null)
}

// --- Internal ---

// Define Observable to maintain indicator state
const backgroundTaskIndicatorStatus$ = new BehaviorSubject<BackgroundTaskStatus>(
	BackgroundTaskStatus.NONE,
)

// Define command handlers
const handleSetStatus: Client.Commands.Handler<BackgroundTaskStatus> = ({ payload }) =>
	backgroundTaskIndicatorStatus$.next(payload)
const handleResetStatus = () => backgroundTaskIndicatorStatus$.next(BackgroundTaskStatus.NONE)
const handleSaving = () => backgroundTaskIndicatorStatus$.next(BackgroundTaskStatus.SAVING)
const handleLoading = () => backgroundTaskIndicatorStatus$.next(BackgroundTaskStatus.LOADING)

/**
 * Saving indicator component.
 */
const SavingIndicator = () => (
	<div className="fixed right-2 top-2">
		<AiOutlineSave className="animate-pulse" />
	</div>
)

/**
 * Loading indicator component.
 */
const LoadingIndicator = () => (
	<div className="fixed right-2 top-2 animate-pulse">
		<AiOutlineLoading3Quarters className="animate-spin" />
	</div>
)
