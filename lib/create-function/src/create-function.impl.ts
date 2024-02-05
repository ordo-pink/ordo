// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { RegisterFunction } from "./create-function.types"

import { KnownFunctions } from "@ordo-pink/known-functions"
import { getCommands } from "@ordo-pink/frontend-stream-commands"
import { getLogger } from "@ordo-pink/frontend-logger"
import { getUser } from "@ordo-pink/frontend-stream-user"

export const createFunction: RegisterFunction = (name, permissions, callback) => {
	const fid = KnownFunctions.register(name)

	const getDataPatched = () => null
	const getCommandsPatched = () => getCommands(fid)
	const getLoggerPatched = () => getLogger(fid)
	const getUserPatched = () => getUser(fid)

	return callback({
		getData: getDataPatched,
		getCommands: getCommandsPatched,
		getLogger: getLoggerPatched,
		getUser: getUserPatched,
	})
}
