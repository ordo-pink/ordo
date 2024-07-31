// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { AiOutlineLoading3Quarters, AiOutlineSave } from "react-icons/ai"
import { BehaviorSubject } from "rxjs"
import { useEffect } from "react"

import { BackgroundTaskStatus } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { use$ } from "@ordo-pink/frontend-react-hooks"

import Null from "@ordo-pink/frontend-react-components/null"

/**
 * Shows a small icon in the top right corner of the screen when something is going on. Appears on
 * setting background task status to something other than 0 (`BackgroundTask.Status.NONE`). Status
 * can be changed with the `application.background_task.set_status` command.
 *
 * NOTE: You probably won't ever need that command as it is intended to be used automatically when
 * fetch is called.
 *
 * @commands
 * - `application.background_task.set_status`
 * - `application.background_task.reset_status`
 */
export default function BackgroundTaskIndicator() {
	const status = use$.strict_subscription(
		background_task_indicator_status$,
		BackgroundTaskStatus.NONE,
	)
	const commands = use$.commands()

	useEffect(() => {
		commands.on<cmd.application.background_task.set_status>(
			"application.background_task.set_status",
			on_set_status,
		)
		commands.on<cmd.application.background_task.reset_status>(
			"application.background_task.reset_status",
			on_reset_status,
		)
		commands.on<cmd.application.background_task.start_loading>(
			"application.background_task.start_loading",
			on_loading,
		)
		commands.on<cmd.application.background_task.start_saving>(
			"application.background_task.start_saving",
			on_saving,
		)

		return () => {
			commands.off<cmd.application.background_task.set_status>(
				"application.background_task.set_status",
				on_set_status,
			)
			commands.off<cmd.application.background_task.reset_status>(
				"application.background_task.reset_status",
				on_reset_status,
			)CommandHandler
			commands.off<cmd.application.background_task.start_loading>(
				"application.background_task.start_loading",
				on_loading,
			)
			commands.off<cmd.application.background_task.start_saving>(
				"application.background_task.start_saving",
				on_saving,
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return Switch.of(status)
		.case(BackgroundTaskStatus.SAVING, SavingIndicator)
		.case(BackgroundTaskStatus.LOADING, LoadingIndicator)
		.default(Null)
}

// --- Internal ---

// Define Observable to maintain indicator state
const background_task_indicator_status$ = new BehaviorSubject<BackgroundTaskStatus>(
	BackgroundTaskStatus.NONE,
)

// Define command handlers
const on_set_status: Client.Commands.Handler<BackgroundTaskStatus> = status =>
	background_task_indicator_status$.next(status)
const on_reset_status = () => background_task_indicator_status$.next(BackgroundTaskStatus.NONE)
const on_saving = () => background_task_indicator_status$.next(BackgroundTaskStatus.SAVING)
const on_loading = () => background_task_indicator_status$.next(BackgroundTaskStatus.LOADING)

/**
 * Saving indicator component.
 */
const SavingIndicator = () => (
	<div className="fixed right-2 top-2">
		<AiOutlineSave className="animate-pulse" />
	</div>
)

/**
 * Loading indicator component.
 */
const LoadingIndicator = () => (
	<div className="fixed right-2 top-2 animate-pulse">
		<AiOutlineLoading3Quarters className="animate-spin" />
	</div>
)
