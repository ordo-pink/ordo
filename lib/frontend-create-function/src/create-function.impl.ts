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

import { getIsAuthenticated, getUser } from "@ordo-pink/frontend-stream-user"
import { DataRepository } from "@ordo-pink/data"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { getCommands } from "@ordo-pink/frontend-stream-commands"
import { getHosts } from "@ordo-pink/frontend-react-hooks"
import { getLogger } from "@ordo-pink/frontend-logger"

import { type RegisterFunction } from "./create-function.types"
import { getData } from "@ordo-pink/frontend-stream-data"

export const createFunction: RegisterFunction = (name, permissions, callback) => {
	const fid = KnownFunctions.register(name, permissions)

	const getCommandsPatched = () => getCommands(fid)
	const getLoggerPatched = () => getLogger(fid)
	const getUserPatched = () => getUser(fid)
	const getIsAuthenticatedPatched = () => getIsAuthenticated(fid)
	const getDataPatched = () => getData(fid)

	return callback({
		getCommands: getCommandsPatched,
		getLogger: getLoggerPatched,
		getUser: getUserPatched,
		getIsAuthenticated: getIsAuthenticatedPatched,
		getHosts,
		data: {
			// TODO
			getChildren: item => DataRepository.getChildren(getDataPatched(), item),
			getData: getDataPatched,
			getParentChain: fsid => DataRepository.getParentChain(getDataPatched(), fsid),
			getDataByFSID: fsid => DataRepository.getDataByFSID(getDataPatched(), fsid),
			getDataByName: (name, parent) =>
				DataRepository.findData(
					getDataPatched(),
					item => item.name === name && item.parent === parent,
				),
			selectDataList: selector => DataRepository.filterData(getDataPatched(), selector),
			selectData: selector => DataRepository.findData(getDataPatched(), selector),
			getDataLabels: () => DataRepository.getAllLabels(getDataPatched()),
			getDataTree: () => DataRepository.getDataTree(getDataPatched()),
		},
	})
}
