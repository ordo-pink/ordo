// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

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
