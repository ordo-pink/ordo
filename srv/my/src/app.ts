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

import { BackgroundTaskIndicator } from "@ordo-pink/frontend-background-task-status"
import { BackgroundTaskStatus } from "@ordo-pink/core"
import { ConsoleLogger } from "@ordo-pink/logger"
import { Maoka } from "@ordo-pink/maoka"

import { init_commands } from "./core/commands"
import { init_known_functions } from "./core/known-functions"
// import { init_logger } from "./core/logger"

// const zags = MaokaZAGS.Of({ counter: { value: 0 } })

const APP_NAME = "pink.ordo.app"
const APP_FID = Symbol.for(APP_NAME)
const APP_FN = { fid: APP_FID, name: APP_NAME, permissions: { commands: [], queries: [] } }

const known_functions = init_known_functions(APP_FN)

export const App = Maoka.create("div", ({ element }) => {
	// const { get_logger } = init_logger(ConsoleLogger, known_functions)
	const { commands } = init_commands(ConsoleLogger, known_functions, APP_FID)

	element.onclick = () => commands.emit("cmd.application.background_task.set_status", BackgroundTaskStatus.LOADING)

	return () => {
		// ON_UPDATE
		return ["adfasdfadsf", BackgroundTaskIndicator(commands)]
	}
})
