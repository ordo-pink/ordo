// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { FSID, PlainData } from "@ordo-pink/data"
import type { Hosts } from "@ordo-pink/frontend-react-hooks"
import type { Logger } from "@ordo-pink/logger"
import type { Permissions } from "@ordo-pink/frontend-known-functions"

export type DataProviders = {
	getData: () => PlainData[] | null
	getChildren: (fsid: FSID) => PlainData[]
	getParentChain: (fsid: FSID) => PlainData[]
	findItemByFSID: (fsid: FSID) => PlainData | null
	findItemByName: (name: string, parent: FSID | null) => PlainData | null
	selectData: (filter: (item: PlainData) => boolean) => PlainData[]
	selectItem: (filter: (item: PlainData) => boolean) => PlainData | null
}

// TODO: Provide missing functions
export type ReigsterFunctionCallbackParams = {
	getCommands: () => Client.Commands.Commands
	getLogger: () => Logger
	getUser: () => User.User | null
	getIsAuthenticated: () => boolean
	getHosts: () => Hosts
	data: DataProviders
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
