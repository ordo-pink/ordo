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

import { ORDO_PINK_HOME_FUNCTION } from "@ordo-pink/core"
import { createFunction } from "@ordo-pink/frontend-create-function"

import { registerGoToHomeCommand } from "./src/commands/go-to-home.command"
import { registerHomeActivity } from "./src/activities/home.activity"

import "./src/function-home.types"
import { registerSupportCommand } from "./src/commands/support.command"

export default createFunction(
	ORDO_PINK_HOME_FUNCTION,
	{ queries: [], commands: [] },
	({ getCommands, getLogger }) => {
		const commands = getCommands()
		const logger = getLogger()

		logger.debug("Initialising...")

		const dropGoToHomeCmd = registerGoToHomeCommand({ commands })
		const dropSupportCmd = registerSupportCommand({ commands })
		const dropHomeActivity = registerHomeActivity({ commands })

		logger.debug("Initialised.")

		return () => {
			logger.debug("Terminating...")

			dropHomeActivity()
			dropSupportCmd()
			dropGoToHomeCmd()

			logger.debug("Terminated.")
		}
	},
)
