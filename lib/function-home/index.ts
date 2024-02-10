// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { ORDO_PINK_HOME_FUNCTION } from "@ordo-pink/core"
import { createFunction } from "@ordo-pink/frontend-create-function"

import { registerGoToHomeCommand } from "./src/commands/go-to-home.command"
import { registerHomeActivity } from "./src/activities/home.activity"

import "./src/function-home.types"

export default createFunction(
	ORDO_PINK_HOME_FUNCTION,
	{ queries: [], commands: [] },
	({ getCommands, getLogger }) => {
		const commands = getCommands()
		const logger = getLogger()

		logger.debug("Initialising...")

		const dropGoToHomeCmd = registerGoToHomeCommand({ commands })
		const dropHomeActivity = registerHomeActivity({ commands })

		logger.debug("Initialised.")

		return () => {
			logger.debug("Terminating...")

			dropHomeActivity()
			dropGoToHomeCmd()

			logger.debug("Terminated.")
		}
	},
)
