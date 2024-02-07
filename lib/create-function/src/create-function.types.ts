// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Hosts } from "@ordo-pink/frontend-react-hooks"
import type { Logger } from "@ordo-pink/logger"
import type { Permissions } from "@ordo-pink/known-functions"
import type { PlainData } from "@ordo-pink/data"

// TODO: Provide missing functions
export type ReigsterFunctionCallbackParams = {
	getCommands: () => Client.Commands.Commands
	getLogger: () => Logger
	getData: () => PlainData[] | null
	getUser: () => User.User | null
	getIsAuthenticated: () => boolean
	getHosts: () => Hosts
}

// TODO: Permissions
export type RegisterFunction = (
	name: string,
	permissions: Permissions,
	callback: (
		params: ReigsterFunctionCallbackParams,
	) => void | Promise<void> | UnregisterFunction | Promise<UnregisterFunction>,
) => void | Promise<void> | UnregisterFunction | Promise<UnregisterFunction>

export type UnregisterFunction = () => void | Promise<void>
