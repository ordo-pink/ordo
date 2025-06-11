import { bs_cloud_download, bs_cloud_upload } from "@ordo-pink/frontend-icons"
import { BACKGROUND_TASK } from "@ordo-pink/sdk-client"
import { maoka } from "@ordo-pink/maoka"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"
import { sweech } from "@ordo-pink/sweech"

import { background_task$ } from "../background-task.state"

export const background_task_status = maoka.create("div", ({ use }) => {
	use(maoka_sdk.jabs.classes.set("background-task"))

	const get_status = use(maoka_sdk.jabs.zags.cheat$(background_task$, "status"))

	return () => {
		const status = get_status()

		return sweech
			.match(status)
			.case(BACKGROUND_TASK.STATUS.LOADING, () => bs_cloud_download({}))
			.case(BACKGROUND_TASK.STATUS.SAVING, () => bs_cloud_upload({}))
			.default(() => void 0)
	}
})
