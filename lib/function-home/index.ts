// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

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
