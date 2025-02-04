/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
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

/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { BS_CLOUD_DOWNLOAD, BS_CLOUD_UPLOAD } from "@ordo-pink/frontend-icons"
import { BackgroundTaskStatus } from "@ordo-pink/core"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaZAGS } from "@ordo-pink/maoka-zags"
import { Switch } from "@ordo-pink/switch"
import { noop } from "@ordo-pink/tau"

import { ordo_app_state } from "../../app.state"

const background_task_status_state = MaokaZAGS.Of({ status: BackgroundTaskStatus.NONE })

const handle_set_status = (status: BackgroundTaskStatus) => background_task_status_state.zags.update("status", () => status)
const handle_start_loading = () => background_task_status_state.zags.update("status", () => BackgroundTaskStatus.LOADING)
const handle_start_saving = () => background_task_status_state.zags.update("status", () => BackgroundTaskStatus.SAVING)
const handle_reset_status = () => background_task_status_state.zags.update("status", () => BackgroundTaskStatus.NONE)

export const OrdoBackgroundTaskIndicator = Maoka.create("div", ({ use, onunmount }) => {
	const get_status = use(background_task_status_state.select_jab$("status"))
	const commands = ordo_app_state.zags.select("commands")

	use(MaokaJabs.set_class("background-task-indicator"))

	commands.on("cmd.application.background_task.set_status", handle_set_status)
	commands.on("cmd.application.background_task.start_loading", handle_start_loading)
	commands.on("cmd.application.background_task.start_saving", handle_start_saving)
	commands.on("cmd.application.background_task.reset_status", handle_reset_status)

	onunmount(() => {
		commands.off("cmd.application.background_task.set_status", handle_set_status)
		commands.off("cmd.application.background_task.start_loading", handle_start_loading)
		commands.off("cmd.application.background_task.start_saving", handle_start_saving)
		commands.off("cmd.application.background_task.reset_status", handle_reset_status)
	})

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
