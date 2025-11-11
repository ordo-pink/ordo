/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { bs_cloud_download, bs_cloud_upload } from "@ordo-pink/frontend-icons"
import { BACKGROUND_TASK } from "@ordo-pink/sdk-client"
import { client_maoka } from "@ordo-pink/sdk-client-maoka"
import { create } from "@ordo-pink/oss-maoka"
import { sweech } from "@ordo-pink/oss-sweech"

import "./background-task.styles.css"

export const background_task_status = create.create("div", ({ use }) => {
	let status = BACKGROUND_TASK.STATUS.NONE

	const { hunter } = use(client_maoka.context.consume)
	use(client_maoka.jabs.classes.set("background-task"))

	const set_status$ = (new_status: BACKGROUND_TASK.STATUS) => {
		status = new_status
		use(create.dom.jabs.refresh$)
	}

	const handle_onmount = () => {
		const release_loading = hunter.track("background_status.loading", () => set_status$(BACKGROUND_TASK.STATUS.LOADING))
		const release_saving = hunter.track("background_status.saving", () => set_status$(BACKGROUND_TASK.STATUS.SAVING))
		const release_none = hunter.track("background_status.none", () => set_status$(BACKGROUND_TASK.STATUS.NONE))

		return () => {
			release_loading()
			release_saving()
			release_none()
		}
	}

	use(create.dom.jabs.onmount(handle_onmount))

	return () =>
		sweech
			.match(status)
			.case(BACKGROUND_TASK.STATUS.LOADING, () => bs_cloud_download({}))
			.case(BACKGROUND_TASK.STATUS.SAVING, () => bs_cloud_upload({}))
			.default(() => null)
})
