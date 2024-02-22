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
				image: `${staticHost}/create-10-files.jpg`,
				description: "Создайте 10 файлов.",
				id: ORDO_PINK_FILE_EXPLORER_FUNCTION.concat(".achievements.create-10-files"),
				title: "Стая Файлы",
				category: "collection",
			},
			subscribe: ({ grant }) => {
				const files = data.getData()

				if (files && files.length >= 10) grant()

				commands.on<cmd.data.create>("data.create", () => {
					const files = data.getData()

					if (files && files.length >= 9) grant()
				})
			},
		})

		commands.emit<cmd.achievements.add>("achievements.add", {
			descriptor: {
				image: `${staticHost}/create-25-files.jpg`,
				description: "Создайте 25 файлов.",
				id: ORDO_PINK_FILE_EXPLORER_FUNCTION.concat(".achievements.create-25-files"),
				title: "Много Файлы",
				category: "collection",
				previous: ORDO_PINK_FILE_EXPLORER_FUNCTION.concat(".achievements.create-10-files"),
			},
			subscribe: ({ grant }) => {
				const files = data.getData()

				if (files && files.length >= 25) grant()

				commands.on<cmd.data.create>("data.create", () => {
					const files = data.getData()

					if (files && files.length >= 24) grant()
				})
			},
		})

		commands.emit<cmd.achievements.add>("achievements.add", {
			descriptor: {
				image: `${staticHost}/create-50-files.jpg`,
				description: "Создайте 50 файлов.",
				id: ORDO_PINK_FILE_EXPLORER_FUNCTION.concat(".achievements.create-50-files"),
				title: "Ordo Файлы",
				category: "collection",
				previous: ORDO_PINK_FILE_EXPLORER_FUNCTION.concat(".achievements.create-25-files"),
			},
			subscribe: ({ grant }) => {
				const files = data.getData()

				if (files && files.length >= 50) grant()

				commands.on<cmd.data.create>("data.create", () => {
					const files = data.getData()

					if (files && files.length >= 49) grant()
				})
			},
		})

		commands.emit<cmd.achievements.add>("achievements.add", {
			descriptor: {
				image: `${staticHost}/create-100-files.jpg`,
				description: "Создайте 100 файлов.",
				id: ORDO_PINK_FILE_EXPLORER_FUNCTION.concat(".achievements.create-100-files"),
				title: "Толпа Файлы",
				category: "collection",
				previous: ORDO_PINK_FILE_EXPLORER_FUNCTION.concat(".achievements.create-50-files"),
			},
			subscribe: ({ grant }) => {
				const files = data.getData()

				if (files && files.length >= 50) grant()

				commands.on<cmd.data.create>("data.create", () => {
					const files = data.getData()

					if (files && files.length >= 49) grant()
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
