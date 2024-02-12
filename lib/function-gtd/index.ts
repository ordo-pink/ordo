// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { ORDO_PINK_GTD_FUNCTION } from "@ordo-pink/core"
import { createFunction } from "@ordo-pink/frontend-create-function"

import { registerAddToProjectsCmd } from "./src/commands/add-to-projects.command"
import { registerGTDActivity } from "./src/activities/gtd.activity"
import { registerMarkDoneCmd } from "./src/commands/mark-done.command"
import { registerMarkNotDoneCmd } from "./src/commands/mark-not-done.command"
import { registerOpenInboxCmd } from "./src/commands/open-inbox.command"
import { registerOpenProjectCmd } from "./src/commands/open-project.command"
import { registerRemoveFromProjectsCmd } from "./src/commands/remove-from-projects.command"
import { registerShowQuickReminderModalCmd } from "./src/commands/show-quick-reminder-modal.command"

export default createFunction(
	ORDO_PINK_GTD_FUNCTION,
	{ queries: [], commands: [] },
	({ getLogger, getCommands, data }) => {
		const commands = getCommands()
		const logger = getLogger()

		logger.debug("Initialising...")

		const dropActivity = registerGTDActivity({ commands })
		const dropOpenInboxCmd = registerOpenInboxCmd({ commands })
		const dropMarkDoneCmd = registerMarkDoneCmd({ commands, data })
		const dropMarkNotDoneCmd = registerMarkNotDoneCmd({ commands, data })
		const dropOpenProjectCmd = registerOpenProjectCmd({ commands, data })
		const dropAddToProjectsCmd = registerAddToProjectsCmd({ commands, data })
		const dropRemoveFromProjectsCmd = registerRemoveFromProjectsCmd({ commands, data })
		const dropShowQuickReminderModalCmd = registerShowQuickReminderModalCmd({ commands })

		logger.debug("Initialised.")

		return () => {
			logger.debug("Terminating...")

			dropActivity()
			dropMarkDoneCmd()
			dropOpenInboxCmd()
			dropMarkNotDoneCmd()
			dropOpenProjectCmd()
			dropAddToProjectsCmd()
			dropRemoveFromProjectsCmd()
			dropShowQuickReminderModalCmd()

			logger.debug("Terminated.")
		}
	},
)
