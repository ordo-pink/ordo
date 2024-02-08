// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { createFunction } from "@ordo-pink/create-function"
import { registerFileExplorerActivity } from "./src/activities/file-explorer.activity"
import { registerGoToFileExplorerCommand } from "./src/commands/go-to-file-explorer.command"
import { registerShowInFileExplorerCommand } from "./src/commands/show-in-file-explorer.command"

export default createFunction(
	"pink.ordo.file-explorer",
	{ queries: [], commands: [] },
	({ getCommands, getLogger, data }) => {
		const commands = getCommands()
		const logger = getLogger()

		logger.debug("Initialising function file-explorer...")

		const dropGoToFileExplorerCmd = registerGoToFileExplorerCommand({ commands })
		const dropShowInFileExplorerCmd = registerShowInFileExplorerCommand({ commands, data })
		const dropFileExplorerActivity = registerFileExplorerActivity({ commands })

		logger.debug("Initialised function file-explorer.")

		return () => {
			logger.debug("Disabling function file-explorer...")

			dropGoToFileExplorerCmd()
			dropShowInFileExplorerCmd()
			dropFileExplorerActivity()

			logger.debug("Disabled function file-explorer.")
		}
	},
)
