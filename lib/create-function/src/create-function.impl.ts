// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { getIsAuthenticated, getUser } from "@ordo-pink/frontend-stream-user"
import { KnownFunctions } from "@ordo-pink/known-functions"
import { getCommands } from "@ordo-pink/frontend-stream-commands"
import { getHosts } from "@ordo-pink/frontend-react-hooks"
import { getLogger } from "@ordo-pink/frontend-logger"

import { type RegisterFunction } from "./create-function.types"

export const createFunction: RegisterFunction = (name, permissions, callback) => {
	const fid = KnownFunctions.register(name, permissions)

	const getDataPatched = () => null
	const getCommandsPatched = () => getCommands(fid)
	const getLoggerPatched = () => getLogger(fid)
	const getUserPatched = () => getUser(fid)
	const getIsAuthenticatedPatched = () => getIsAuthenticated(fid)

	return callback({
		getData: getDataPatched,
		getCommands: getCommandsPatched,
		getLogger: getLoggerPatched,
		getUser: getUserPatched,
		getIsAuthenticated: getIsAuthenticatedPatched,
		getHosts,
	})
}
