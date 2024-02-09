// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { ORDO_PINK_LINKS_FUNCTION } from "@ordo-pink/core"
import { createFunction } from "@ordo-pink/frontend-create-function"
import { registerLinksActivity } from "./src/activities/links.activity"

export default createFunction(
	ORDO_PINK_LINKS_FUNCTION,
	{ queries: [], commands: [] },
	({ getCommands, getLogger }) => {
		const commands = getCommands()
		const logger = getLogger()

		logger.debug("Initialising...")

		const dropLinksActivity = registerLinksActivity({ commands })

		logger.debug("Initialised.")

		return () => {
			logger.debug("Terminating...")

			dropLinksActivity()

			logger.debug("Terminated.")
		}
	},
)
