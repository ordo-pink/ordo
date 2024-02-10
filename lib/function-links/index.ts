// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { ORDO_PINK_LINKS_FUNCTION } from "@ordo-pink/core"
import { createFunction } from "@ordo-pink/frontend-create-function"

import { registerGoToLinksCommand } from "./src/commands/go-to-links.command"
import { registerLinksActivity } from "./src/activities/links.activity"
import { registerShowLabelInLinksCommand } from "./src/commands/show-label-links.command"

export default createFunction(
	ORDO_PINK_LINKS_FUNCTION,
	{ queries: [], commands: [] },
	({ getCommands, getLogger, data }) => {
		const commands = getCommands()
		const logger = getLogger()

		logger.debug("Initialising...")

		const dropGoToLinksCmd = registerGoToLinksCommand({ commands })
		const dropShowLabelInLinksCmd = registerShowLabelInLinksCommand({ commands, data })
		const dropLinksActivity = registerLinksActivity({ commands })

		logger.debug("Initialised.")

		return () => {
			logger.debug("Terminating...")

			dropGoToLinksCmd()
			dropShowLabelInLinksCmd()
			dropLinksActivity()

			logger.debug("Terminated.")
		}
	},
)
