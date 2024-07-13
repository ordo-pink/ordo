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

import { lazy } from "react"

import { ORDO_PINK_USER_FUNCTION } from "@ordo-pink/core"
import { createFunction } from "@ordo-pink/frontend-create-function"

import { registerGoToAccountCommand } from "./src/commands/go-to-account.command"
import { registerSignOutCommand } from "./src/commands/sign-out.command"

export default createFunction(
	ORDO_PINK_USER_FUNCTION,
	{ queries: [], commands: [] },
	({ getCommands, getHosts, getLogger, registerActivity }) => {
		const commands = getCommands()
		const logger = getLogger()
		const { website_host: websiteHost, static_host: staticHost } = getHosts()

		logger.debug("Intialising...")

		const unregisterActivity = registerActivity({
			Component: lazy(() => import("./src/views/user.workspace")),
			name: ORDO_PINK_USER_FUNCTION.concat(".activity.main"),
			routes: ["/user"],
			background: true,
		})

		const dropGoToAccountCmd = registerGoToAccountCommand({ commands })
		const dropSignOutCmd = registerSignOutCommand({ commands, websiteHost })

		commands.emit<cmd.achievements.add>("achievements.add", {
			descriptor: {
				id: ORDO_PINK_USER_FUNCTION.concat(".achievements.beta-participation"),
				image: `${staticHost}/beta-participation-logo.jpg`,
				description: "Зарегистрируйтесь и войдите в систему во время проведения Beta-тестирования.",
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

			unregisterActivity()

			dropGoToAccountCmd()
			dropSignOutCmd()

			logger.debug("Terminated.")
		}
	},
)
