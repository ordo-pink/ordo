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

import { ORDO_PINK_GTD_FUNCTION } from "@ordo-pink/core"
import { createFunction } from "@ordo-pink/frontend-create-function"

import { registerAchievements } from "./src/achievements/gtd.achievements"
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
	({ getLogger, getCommands, data, getHosts }) => {
		const commands = getCommands()
		const logger = getLogger()
		const { staticHost } = getHosts()

		logger.debug("Initialising...")

		const dropActivity = registerGTDActivity({ commands })
		const dropOpenInboxCmd = registerOpenInboxCmd({ commands })
		const dropMarkDoneCmd = registerMarkDoneCmd({ commands, data })
		const dropMarkNotDoneCmd = registerMarkNotDoneCmd({ commands, data })
		const dropOpenProjectCmd = registerOpenProjectCmd({ commands, data })
		const dropAddToProjectsCmd = registerAddToProjectsCmd({ commands, data })
		const dropRemoveFromProjectsCmd = registerRemoveFromProjectsCmd({ commands, data })
		const dropShowQuickReminderModalCmd = registerShowQuickReminderModalCmd({ commands })

		registerAchievements({ commands, data, staticHost })

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
