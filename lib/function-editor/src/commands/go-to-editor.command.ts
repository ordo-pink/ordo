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

import { BsLayoutSidebar } from "react-icons/bs"

const COMMAND_NAME = "editor.go-to-editor"

type P = { commands: Client.Commands.Commands }
export const registerGoToEditorCommand = (params: P) => {
	const unregisterCommand = registerCommand(params)
	const unregisterCommandPalette = registerCommandPalette(params)

	return () => {
		unregisterCommand()
		unregisterCommandPalette()
	}
}

// --- Internal ---

const registerCommand = ({ commands }: P) => {
	const handler = () => commands.emit<cmd.router.navigate>("router.navigate", "/editor")

	commands.on<cmd.editor.goToEditor>(COMMAND_NAME, handler)

	return () => {
		commands.off<cmd.editor.goToEditor>(COMMAND_NAME, handler)
	}
}

const registerCommandPalette = ({ commands }: P) => {
	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: COMMAND_NAME,
		Icon: BsLayoutSidebar,
		onSelect: () => {
			commands.emit<cmd.editor.goToEditor>(COMMAND_NAME)
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
		},
		readableName: "Открыть редактор",
		accelerator: "mod+e",
	})

	return () => {
		commands.emit<cmd.commandPalette.remove>("command-palette.remove", COMMAND_NAME)
	}
}
