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
import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"
import { sweech } from "@ordo-pink/oss-sweech"

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
			.default(() => null)
	}
})
