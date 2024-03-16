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

import { BsInbox } from "react-icons/bs"

const COMMAND_NAME = "gtd.open-inbox"

type P = { commands: Client.Commands.Commands }
export const registerOpenInboxCmd = ({ commands }: P) => {
	const dropCommand = registerCommand({ commands })
	const dropCommandPalette = registerCommandPalette({ commands })

	return () => {
		dropCommand()
		dropCommandPalette()
	}
}

const registerCommandPalette = ({ commands }: P) => {
	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: COMMAND_NAME,
		Icon: BsInbox,
		readableName: "Открыть задачи",
		accelerator: "meta+shift+i",
		onSelect: () => {
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
			commands.emit<cmd.gtd.openInbox>(COMMAND_NAME)
		},
	})

	return () => {
		commands.emit<cmd.commandPalette.remove>("command-palette.remove", COMMAND_NAME)
	}
}

const registerCommand = ({ commands }: P) => {
	const handler = handle({ commands })

	commands.on<cmd.gtd.openInbox>(COMMAND_NAME, handler)

	return () => {
		commands.off<cmd.gtd.openInbox>(COMMAND_NAME, handler)
	}
}

const handle =
	({ commands }: P) =>
	() =>
		commands.emit<cmd.router.navigate>("router.navigate", "/gtd")
