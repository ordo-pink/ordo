// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PlainData } from "@ordo-pink/data"
import { Logger } from "@ordo-pink/logger"

export type ReigsterFunctionCallbackParams = {
	getCommands: () => Client.Commands.Commands
	getLogger: () => Logger
	getData: () => PlainData[] | null
	getUser: () => User.User | null
}

// TODO: Permissions
export type RegisterFunction = (
	name: string,
	permissions: Record<string, unknown>,
	callback: (
		params: ReigsterFunctionCallbackParams,
	) => void | Promise<void> | UnregisterFunction | Promise<UnregisterFunction>,
) => void | Promise<void> | UnregisterFunction | Promise<UnregisterFunction>

export type UnregisterFunction = () => void | Promise<void>
