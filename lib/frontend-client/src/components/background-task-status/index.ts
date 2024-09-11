import { Observable } from "rxjs"

import { BS_CLOUD_DOWNLOAD, BS_CLOUD_UPLOAD } from "@ordo-pink/frontend-icons"
import { create, set_inner_html } from "@ordo-pink/maoka"
import { BackgroundTaskStatus } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { noop } from "@ordo-pink/tau"
import { rx_subscription } from "@ordo-pink/maoka-ordo-hooks"

export const BackgroundTaskStatusIndicator = ($: Observable<BackgroundTaskStatus>) =>
	create("div", ({ use }) => {
		const status = use(rx_subscription($, "background_task_status"))

		return Switch.Match(status)
			.case(BackgroundTaskStatus.LOADING, () => LoadingIcon)
			.case(BackgroundTaskStatus.SAVING, () => SavingIcon)
			.default(() => NoIcon)
	})

const LoadingIcon = create("span", ({ use }) => {
	use(set_inner_html(BS_CLOUD_DOWNLOAD))
})

const SavingIcon = create("span", ({ use }) => {
	use(set_inner_html(BS_CLOUD_UPLOAD))
})

const NoIcon = create("span", noop)
