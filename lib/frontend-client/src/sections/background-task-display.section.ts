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

import { BehaviorSubject } from "rxjs"

import { BackgroundTaskStatus } from "@ordo-pink/core"
import { O } from "@ordo-pink/option"
import { type TLogger } from "@ordo-pink/logger"
import { render_dom } from "@ordo-pink/maoka"

import { BackgroundTaskStatusIndicator } from "../components/background-task-status"

export const init_background_task_display = (
	logger: TLogger,
	commands: Client.Commands.Commands,
) => {
	logger.debug("🟡 Initialising background task indicator...")

	commands.on("cmd.application.background_task.set_status", status => bg_task$.next(status))
	commands.on("cmd.application.background_task.reset_status", () =>
		bg_task$.next(BackgroundTaskStatus.NONE),
	)
	commands.on("cmd.application.background_task.start_loading", () =>
		bg_task$.next(BackgroundTaskStatus.LOADING),
	)
	commands.on("cmd.application.background_task.start_saving", () =>
		bg_task$.next(BackgroundTaskStatus.SAVING),
	)

	O.FromNullable(document.querySelector("#background-task-indicator"))
		.pipe(O.ops.chain(root => (root instanceof HTMLDivElement ? O.Some(root) : O.None())))
		.pipe(O.ops.map(root => ({ root, component: BackgroundTaskStatusIndicator(bg_task$) })))
		.pipe(O.ops.map(({ root, component }) => render_dom(root, component)))
		.cata(O.catas.or_else(log_div_not_found(logger)))

	logger.debug("🟢 Initialised background task indicator.")
}

const bg_task$ = new BehaviorSubject<BackgroundTaskStatus>(BackgroundTaskStatus.NONE)

const log_div_not_found = (logger: TLogger) => () =>
	logger.error("#background-task-indicator div not found.")
