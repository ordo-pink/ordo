// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { ORDO_PINK_EDITOR_FUNCTION } from "@ordo-pink/core"
import { createFunction } from "@ordo-pink/frontend-create-function"
import { registerEditorActivity } from "./src/activities/editor.activity"

export default createFunction(
	ORDO_PINK_EDITOR_FUNCTION,
	{ commands: [], queries: [] },
	({ getCommands, getLogger }) => {
		const commands = getCommands()
		const logger = getLogger()

		logger.debug("Initialising...")

		const dropEditorActivity = registerEditorActivity({ commands })

		logger.debug("Initialised.")

		return () => {
			logger.debug("Terminating...")

			dropEditorActivity()

			logger.debug("Terminated.")
		}
	},
)
