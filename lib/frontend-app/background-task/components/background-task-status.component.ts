import { bs_cloud_download, bs_cloud_upload } from "@ordo-pink/frontend-icons"
import { BACKGROUND_TASK } from "@ordo-pink/sdk-client"
import type { Zags } from "@ordo-pink/zags"
import { maoka } from "@ordo-pink/maoka"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"
import { sweech } from "@ordo-pink/sweech"

export const background_task_status = maoka.create<{ $: Zags.Instance<{ status: BACKGROUND_TASK.STATUS }> }>(
	"div",
	({ $, use }) => {
		use(maoka_jabs.set_class("background-task"))

		const get_status = use(maoka_jabs.cheat$($, "status"))

		return () => {
			const status = get_status()

			return sweech
				.match(status)
				.case(BACKGROUND_TASK.STATUS.LOADING, () => bs_cloud_download({}))
				.case(BACKGROUND_TASK.STATUS.SAVING, () => bs_cloud_upload({}))
				.default(() => void 0)
		}
	},
)
