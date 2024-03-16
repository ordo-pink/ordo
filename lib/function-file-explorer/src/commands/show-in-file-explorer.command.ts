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

import { BsFolder2Open } from "react-icons/bs"

import { type DataProviders } from "@ordo-pink/frontend-create-function"
import { type FSID } from "@ordo-pink/data"
import { Switch } from "@ordo-pink/switch"

type P = { commands: Client.Commands.Commands; data: DataProviders }
export const registerShowInFileExplorerCommand = (params: P) => {
	const unregisterCommand = registerCommand(params)
	const unregisterContextMenu = registerContextMenu(params)
	// TODO: registerCommandPalette

	return () => {
		unregisterCommand()
		unregisterContextMenu()
	}
}

// --- Internal ---

const registerCommand = (params: P) => {
	params.commands.on<cmd.fileExplorer.showInFileExplorer>(
		"file-explorer.show-in-file-explorer",
		commandHandler(params),
	)

	return () => {
		params.commands.off<cmd.fileExplorer.showInFileExplorer>(
			"file-explorer.show-in-file-explorer",
			commandHandler(params),
		)
	}
}

const registerContextMenu = ({ commands }: P) => {
	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: "file-explorer.show-in-file-explorer",
		Icon: BsFolder2Open,
		readableName: "Открыть в менеджере файлов",
		type: "read",
		accelerator: "mod+shift+e",
		shouldShow: ({ payload }) => !!payload && !window.location.pathname.startsWith("/fs"),
	})

	return () => {
		commands.emit<cmd.ctxMenu.remove>("context-menu.remove", "file-explorer.show-in-file-explorer")
	}
}

const commandHandler =
	({ data, commands }: P) =>
	(fsid: FSID) => {
		const children = data.getChildren(fsid)
		const item = data.getDataByFSID(fsid)

		const route = Switch.empty()
			.case(children.length > 0, () => `/fs/${fsid}`)
			.case(!!item && !item.parent, () => `/fs/${item!.parent}?selected=${fsid}`)
			.case(!!item && !!item.parent, () => `/fs?selected=${fsid}`)
			.default(() => void 0)

		commands.emit<cmd.router.navigate>("router.navigate", route)
	}
