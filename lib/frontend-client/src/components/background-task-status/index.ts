import { Observable } from "rxjs"

import { BS_CLOUD_DOWNLOAD, BS_CLOUD_UPLOAD } from "@ordo-pink/frontend-icons"
import { BackgroundTaskStatus } from "@ordo-pink/core"
import { Maoka } from "@ordo-pink/maoka"
import { OrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { Switch } from "@ordo-pink/switch"
import { noop } from "@ordo-pink/tau"

export const BackgroundTaskStatusIndicator = ($: Observable<BackgroundTaskStatus>) =>
	Maoka.create("div", ({ use, refresh }) => {
		let status = BackgroundTaskStatus.NONE

		const handle_status_update = (new_status: BackgroundTaskStatus) => {
			if (new_status < BackgroundTaskStatus.length && status !== new_status) {
				status = new_status
				refresh()
			}
		}

		use(OrdoHooks.subscription($, handle_status_update))

		return () =>
			Switch.Match(status)
				.case(BackgroundTaskStatus.LOADING, () => LoadingIcon)
				.case(BackgroundTaskStatus.SAVING, () => SavingIcon)
				.default(() => NoIcon)
	})

// --- Internal ---

const LoadingIcon = Maoka.create("span", ({ use }) => {
	use(Maoka.hooks.set_inner_html(BS_CLOUD_DOWNLOAD))
})

const SavingIcon = Maoka.create("span", ({ use }) => {
	use(Maoka.hooks.set_inner_html(BS_CLOUD_UPLOAD))
})

const NoIcon = Maoka.create("span", noop)
