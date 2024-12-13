/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { BS_CLOUD_DOWNLOAD, BS_CLOUD_UPLOAD } from "@ordo-pink/frontend-icons"
import { BackgroundTaskStatus } from "@ordo-pink/core"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaZAGS } from "@ordo-pink/maoka-zags"
import { Switch } from "@ordo-pink/switch"
import { noop } from "@ordo-pink/tau"

const zags = MaokaZAGS.Of({ status: BackgroundTaskStatus.NONE })

const handle_set_status = (status: BackgroundTaskStatus) => zags.update("status", status)
const handle_start_loading = () => zags.update("status", BackgroundTaskStatus.LOADING)
const handle_start_saving = () => zags.update("status", BackgroundTaskStatus.SAVING)
const handle_reset_status = () => zags.update("status", BackgroundTaskStatus.NONE)

export const BackgroundTaskIndicator = (commands: Ordo.Command.Commands) =>
	Maoka.create("div", ({ use, on_unmount }) => {
		const get_status = use(zags.select_jab$(state => state.status))

		commands.on("cmd.application.background_task.set_status", handle_set_status)
		commands.on("cmd.application.background_task.start_loading", handle_start_loading)
		commands.on("cmd.application.background_task.start_saving", handle_start_saving)
		commands.on("cmd.application.background_task.reset_status", handle_reset_status)

		on_unmount(() => {
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
