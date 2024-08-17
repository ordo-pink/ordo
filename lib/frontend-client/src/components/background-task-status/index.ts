import { BS_CLOUD_DOWNLOAD, BS_CLOUD_UPLOAD } from "@ordo-pink/frontend-icons"
import { BackgroundTaskStatus } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { create } from "@ordo-pink/maoka"
import { noop } from "@ordo-pink/tau"

import { type TBackgroundTaskStatusHook } from "../../hooks/use-background-task-status.hook"

const span = create("span")
const div = create<TBackgroundTaskStatusHook>("span")

export const BackgroundTaskStatusIndicator = div(use => {
	const status = use.background_task_status()

	return Switch.Match(status)
		.case(BackgroundTaskStatus.LOADING, () => LoadingIcon)
		.case(BackgroundTaskStatus.SAVING, () => SavingIcon)
		.default(() => NoIcon)
})

const LoadingIcon = span({ unsafe_inner_html: BS_CLOUD_DOWNLOAD })

const SavingIcon = span({ unsafe_inner_html: BS_CLOUD_UPLOAD })

const NoIcon = span(noop)
