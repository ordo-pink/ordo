import { bs_cloud_download, bs_cloud_upload } from "@ordo-pink/frontend-icons"
import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"
import { sweech } from "@ordo-pink/oss-sweech"

import "./background-task.styles.css"

export const background_task_status = maoka.create("div", ({ use, refresh$ }) => {
	let status = ORDO_CLIENT.BACKGROUND_TASK.STATUS.NONE

	const { hunter } = use(ordo_client_maoka.context.consume)

	use(ordo_client_maoka.jabs.set_attribute("id", "bts"))
	use(ordo_client_maoka.jabs.set_class("background-task"))

	const set_status$ = (new_status: OrdoClient.BackgroundTask.Status) => {
		status = new_status
		refresh$()
	}

	const handle_onmount = () => {
		const drop_load = hunter.track("background_status.loading", () => set_status$(ORDO_CLIENT.BACKGROUND_TASK.STATUS.LOADING))
		const drop_save = hunter.track("background_status.saving", () => set_status$(ORDO_CLIENT.BACKGROUND_TASK.STATUS.SAVING))
		const drop_none = hunter.track("background_status.none", () => set_status$(ORDO_CLIENT.BACKGROUND_TASK.STATUS.NONE))

		return () => {
			drop_load()
			drop_save()
			drop_none()
		}
	}

	use(maoka_dom.jabs.onmount(handle_onmount))

	return () =>
		sweech
			.match(status)
			.case(ORDO_CLIENT.BACKGROUND_TASK.STATUS.LOADING, () => bs_cloud_download({}))
			.case(ORDO_CLIENT.BACKGROUND_TASK.STATUS.SAVING, () => bs_cloud_upload({}))
			.default(() => null)
})
