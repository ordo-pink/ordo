/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { bs_cloud_download, bs_cloud_upload } from "@ordo-pink/frontend-icons"
import { maoka } from "@ordo-pink/oss-maoka"
import { sweech } from "@ordo-pink/oss-sweech"

import "./background-task.styles.css"

export const background_task_status = maoka.create("div", ({ use, refresh$ }) => {
	let status = STATUS.NONE

	const set_status$ = (new_status: OrdoClient.BackgroundTask.Status) => {
		status = new_status
		refresh$()
	}

	const handle_loading = () => set_status$(STATUS.LOADING)
	const handle_reset = () => set_status$(STATUS.NONE)
	const handle_saving = () => set_status$(STATUS.SAVING)

	use(ordo_client_maoka.jabs.set_id("bts"))
	use(ordo_client_maoka.jabs.handle_command("@ordo/main.background_status.loading", handle_loading))
	use(ordo_client_maoka.jabs.handle_command("@ordo/main.background_status.reset", handle_reset))
	use(ordo_client_maoka.jabs.handle_command("@ordo/main.background_status.saving", handle_saving))

	return () =>
		sweech
			.match(status)
			.case(STATUS.LOADING, () => bs_cloud_download())
			.case(STATUS.SAVING, () => bs_cloud_upload())
			.default(() => null)
})

// --- Internal ---

const STATUS = ORDO_CLIENT.BACKGROUND_TASK.STATUS
