import { AiOutlineLoading3Quarters, AiOutlineSave } from "react-icons/ai"
import { BehaviorSubject } from "rxjs"
import { useEffect } from "react"
import { useStrictSubscription } from "$hooks/use-subscription"
import { BackgroundTaskStatus, useSharedContext } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import Null from "./null"

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
	const status = useStrictSubscription(saving$, BackgroundTaskStatus.NONE)
	const { commands } = useSharedContext()

	useEffect(() => {
		commands.on<cmd.background.setStatus>("background-task.set-status", setStatus)
		commands.on<cmd.background.resetStatus>("background-task.reset-status", resetStatus)

		return () => {
			commands.off<cmd.background.setStatus>("background-task.set-status", setStatus)
			commands.off<cmd.background.resetStatus>("background-task.reset-status", resetStatus)
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
const saving$ = new BehaviorSubject<BackgroundTaskStatus>(BackgroundTaskStatus.NONE)

// Define command handlers
const setStatus: Client.Commands.Handler<BackgroundTaskStatus> = ({ payload }) =>
	saving$.next(payload)
const resetStatus = () => saving$.next(BackgroundTaskStatus.NONE)

/**
 * Saving indicator component.
 */
const SavingIndicator = () => (
	<div className="fixed top-2 right-2">
		<AiOutlineSave className="animate-pulse" />
	</div>
)

/**
 * Loading indicator component.
 */
const LoadingIndicator = () => (
	<div className="fixed top-2 right-2 animate-pulse">
		<AiOutlineLoading3Quarters className="animate-spin" />
	</div>
)
