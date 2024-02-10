// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { createFunction } from "@ordo-pink/frontend-create-function"

import { registerGoToAccountCommand } from "./src/commands/go-to-account.command"
import { registerSignOutCommand } from "./src/commands/sign-out.command"
import { registerUserActivity } from "./src/activities/user.activity"

export default createFunction(
	"pink.ordo.user",
	{ queries: [], commands: [] },
	({ getCommands, getHosts, getLogger, data }) => {
		const commands = getCommands()
		const logger = getLogger()
		const { websiteHost, staticHost } = getHosts()

		logger.debug("Intialising...")

		const dropUserActivity = registerUserActivity({ commands })
		const dropGoToAccountCmd = registerGoToAccountCommand({ commands })
		const dropSignOutCmd = registerSignOutCommand({ commands, websiteHost })

		commands.emit<cmd.achievements.add>("achievements.add", {
			descriptor: {
				icon: `${staticHost}/beta-participation-logo.jpg`,
				completedAt: null,
				description: "Зарегистрируйтесь и войдите в систему во время проведения Beta-тестирования.",
				id: "pink.ordo.user.achievements.beta-participation",
				title: "Участие в β",
			},
			subscribe: ({ grant }) => {
				grant()
			},
		})

		commands.emit<cmd.achievements.add>("achievements.add", {
			descriptor: {
				icon: `${staticHost}/beta-participation-logo.jpg`,
				completedAt: null,
				description: "Создайте 3 метки.",
				id: "pink.ordo.user.achievements.3-labels",
				title: "Red Label",
			},
			subscribe: ({ grant }) => {
				const labels = data.getDataLabels()

				if (labels.length >= 3) grant()

				commands.on<cmd.data.addLabel>("data.add-label", () => {
					const labels = data.getDataLabels()

					if (labels.length >= 2) grant()
				})
			},
		})

		logger.debug("Initialised.")

		return () => {
			logger.debug("Terminating...")

			dropUserActivity()
			dropGoToAccountCmd()
			dropSignOutCmd()

			logger.debug("Terminated.")
		}
	},
)
