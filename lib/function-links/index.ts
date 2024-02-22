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
