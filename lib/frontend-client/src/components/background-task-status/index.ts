import { Observable } from "rxjs"

import { BS_CLOUD_DOWNLOAD, BS_CLOUD_UPLOAD } from "@ordo-pink/frontend-icons"
import { BackgroundTaskStatus } from "@ordo-pink/core"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Switch } from "@ordo-pink/switch"
import { noop } from "@ordo-pink/tau"

export const BackgroundTaskIndicator = ($: Observable<BackgroundTaskStatus>) =>
	Maoka.create("div", ({ use }) => {
		const get_status = use(MaokaOrdo.Jabs.from$($, BackgroundTaskStatus.NONE))

		return () => {
			const status = get_status()

			return Switch.Match(status)
				.case(BackgroundTaskStatus.LOADING, () => LoadingIcon)
				.case(BackgroundTaskStatus.SAVING, () => SavingIcon)
				.default(() => NoIcon)
		}
	})

// --- Internal ---

const LoadingIcon = Maoka.html("span", BS_CLOUD_DOWNLOAD)
const SavingIcon = Maoka.html("span", BS_CLOUD_UPLOAD)
const NoIcon = Maoka.create("span", noop)
