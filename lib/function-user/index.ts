// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { ORDO_PINK_USER_FUNCTION } from "@ordo-pink/core"
import { createFunction } from "@ordo-pink/frontend-create-function"

import { registerGoToAccountCommand } from "./src/commands/go-to-account.command"
import { registerSignOutCommand } from "./src/commands/sign-out.command"
import { registerUserActivity } from "./src/activities/user.activity"

export default createFunction(
	ORDO_PINK_USER_FUNCTION,
	{ queries: [], commands: [] },
	({ getCommands, getHosts, getLogger }) => {
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
				id: ORDO_PINK_USER_FUNCTION.concat(".achievements.beta-participation"),
				title: "Участие в β",
				category: "legacy",
			},
			subscribe: ({ grant }) => {
				grant()
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
