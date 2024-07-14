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

import { DataQuery, DataRepository } from "@ordo-pink/data"
import { getData, getData$ } from "@ordo-pink/frontend-stream-data"
import { get_user, _get_is_authenticated } from "@ordo-pink/frontend-stream-user"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { _get_commands } from "@ordo-pink/frontend-stream-commands"
import { get_hosts_unsafe } from "@ordo-pink/frontend-react-hooks"
import { _get_logger } from "@ordo-pink/frontend-logger"

import { type RegisterFunction } from "./create-function.types"
import { registerActivity } from "@ordo-pink/frontend-stream-activities"

export const createFunction: RegisterFunction = (name, permissions, callback) => {
	const fid = KnownFunctions.register(name, permissions)

	const getCommandsPatched = () => _get_commands(fid)
	const getLoggerPatched = () => _get_logger(fid)
	const getUserPatched = () => get_user(fid)
	const getIsAuthenticatedPatched = () => _get_is_authenticated(fid)
	const getDataPatched = () => getData(fid)
	const registerActivityPatched = registerActivity(fid)

	const data$Patched = getData$(fid)

	const dataQuery = DataQuery.of(data$Patched)

	return callback({
		getCommands: getCommandsPatched,
		getLogger: getLoggerPatched,
		getUser: getUserPatched,
		getIsAuthenticated: getIsAuthenticatedPatched,
		getHosts: get_hosts_unsafe,
		registerActivity: registerActivityPatched,
		data: {
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
		queries: { dataQuery },
	})
}
