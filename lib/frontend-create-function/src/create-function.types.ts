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

import type { FSID, PlainData, TDataQuery } from "@ordo-pink/data"
import type { Hosts } from "@ordo-pink/frontend-react-hooks"
import type { Logger } from "@ordo-pink/logger"
import type { Permissions } from "@ordo-pink/frontend-known-functions"
import { PlainDataNode } from "@ordo-pink/core"

export type DataProviders = {
	getData: () => PlainData[] | null
	getChildren: (fsid: PlainData | FSID | "root" | null) => PlainData[]
	getParentChain: (fsid: FSID) => PlainData[]
	getDataLabels: () => string[]
	getDataTree: () => PlainDataNode[]
	getDataByFSID: (fsid: FSID) => PlainData | null
	getDataByName: (name: string, parent: FSID | null) => PlainData | null
	selectDataList: (filter: (item: PlainData) => boolean) => PlainData[]
	selectData: (filter: (item: PlainData) => boolean) => PlainData | null
}

// TODO: Provide missing functions
export type RegisterFunctionCallbackParams = {
	getCommands: () => Client.Commands.Commands
	getLogger: () => Logger
	getUser: () => User.User | null
	getIsAuthenticated: () => boolean
	getHosts: () => Hosts
	data: DataProviders
	queries: {
		dataQuery: TDataQuery
	}
}

// TODO: Permissions
export type RegisterFunction = (
	name: string,
	permissions: Permissions,
	callback: (
		params: RegisterFunctionCallbackParams,
	) => void | Promise<void> | UnregisterFunction | Promise<UnregisterFunction>,
) => void | Promise<void> | UnregisterFunction | Promise<UnregisterFunction>

export type UnregisterFunction = () => void | Promise<void>
