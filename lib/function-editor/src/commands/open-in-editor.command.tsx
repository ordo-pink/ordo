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

import { BsLayoutTextSidebarReverse } from "react-icons/bs"

import { FSID, PlainData } from "@ordo-pink/data"
import { DataProviders } from "@ordo-pink/frontend-create-function"

import DataIcon from "@ordo-pink/frontend-react-components/data-icon/data-icon.component"

const COMMAND_NAME = "editor.open"

type P = { commands: Client.Commands.Commands; data: DataProviders }
export const registerOpenInEditorCommand = ({ commands, data }: P) => {
	const unregisterCommand = registerCommand({ commands, data })
	const unregisterContextMenu = registerContextMenu({ commands, data })
	const unregisterCommandPalette = registerCommandPalette({ commands, data })

	return () => {
		unregisterCommand()
		unregisterContextMenu()
		unregisterCommandPalette()
	}
}

// --- Internal ---

const registerCommand = ({ commands }: P) => {
	const handle = (fsid: FSID) => {
		commands.emit<cmd.router.navigate>("router.navigate", `/editor/${fsid}`)
	}

	commands.on<cmd.editor.open>(COMMAND_NAME, handle)

	return () => {
		commands.off<cmd.editor.open>(COMMAND_NAME, handle)
	}
}

const registerContextMenu = ({ commands }: P) => {
	commands.emit<cmd.ctx_menu.add>("context-menu.add", {
		cmd: COMMAND_NAME,
		Icon: BsLayoutTextSidebarReverse,
		readable_name: "Открыть в редакторе",
		type: "read",
		accelerator: "mod+e",
		should_show: ({ payload }) =>
			!!payload && payload !== "root" && !window.location.pathname.startsWith("/editor"),
		payload_creator: ({ payload }) => (payload as PlainData).fsid,
	})

	return () => {
		commands.emit<cmd.ctx_menu.remove>("context-menu.remove", COMMAND_NAME)
	}
}

const registerCommandPalette = ({ commands, data }: P) => {
	commands.emit<cmd.command_palette.add>("command-palette.add", {
		id: COMMAND_NAME,
		accelerator: "mod+meta+e",
		readable_name: "Открыть в редакторе...",
		Icon: BsLayoutTextSidebarReverse,
		on_select: () => {
			const files = data.getData()

			if (!files) return

			commands.emit<cmd.command_palette.show>("command-palette.show", {
				items: files.map(
					file =>
						({
							Icon: () => <DataIcon plain={file} />,
							id: file.fsid,
							readable_name: file.name,
							on_select: () => {
								commands.emit<cmd.command_palette.hide>("command-palette.hide")
								commands.emit<cmd.editor.open>("editor.open", file.fsid)
							},
						}) satisfies Client.CommandPalette.Item,
				),
			})
		},
	})

	return () => {
		commands.emit<cmd.command_palette.remove>("command-palette.remove", COMMAND_NAME)
	}
}
