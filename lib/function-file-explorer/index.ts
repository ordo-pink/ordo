// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { ORDO_PINK_FILE_EXPLORER_FUNCTION } from "@ordo-pink/core"
import { createFunction } from "@ordo-pink/frontend-create-function"

import { registerFileExplorerActivity } from "./src/activities/file-explorer.activity"
import { registerGoToFileExplorerCommand } from "./src/commands/go-to-file-explorer.command"
import { registerShowInFileExplorerCommand } from "./src/commands/show-in-file-explorer.command"

export default createFunction(
	ORDO_PINK_FILE_EXPLORER_FUNCTION,
	{ queries: [], commands: [] },
	({ getCommands, getLogger, getHosts, data }) => {
		const commands = getCommands()
		const logger = getLogger()
		const { staticHost } = getHosts()

		logger.debug("Initialising...")

		const dropGoToFileExplorerCmd = registerGoToFileExplorerCommand({ commands })
		const dropShowInFileExplorerCmd = registerShowInFileExplorerCommand({ commands, data })
		const dropFileExplorerActivity = registerFileExplorerActivity({ commands })

		commands.emit<cmd.achievements.add>("achievements.add", {
			descriptor: {
				icon: `${staticHost}/100-files.jpg`,
				completedAt: null,
				description: "Создайте 100 файлов.",
				id: ORDO_PINK_FILE_EXPLORER_FUNCTION.concat(".achievements.100-files"),
				title: "Файловый менеджер",
				category: "collection",
			},
			subscribe: ({ grant }) => {
				const files = data.getData()

				if (files && files.length >= 100) grant()

				commands.on<cmd.data.create>("data.create", () => {
					const files = data.getData()

					if (files && files.length >= 99) grant()
				})
			},
		})

		logger.debug("Initialised.")

		return () => {
			logger.debug("Terminating...")

			dropGoToFileExplorerCmd()
			dropShowInFileExplorerCmd()
			dropFileExplorerActivity()

			logger.debug("Terminated.")
		}
	},
)
