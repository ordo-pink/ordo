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

import { AiOutlineLogout } from "react-icons/ai"

type P = { commands: Client.Commands.Commands; websiteHost: string }
export const registerSignOutCommand = (params: P) => {
	const unregisterCommand = registerCommand(params)
	const unregisterCommandPalette = registerCommandPalette(params)

	return () => {
		unregisterCommand()
		unregisterCommandPalette()
	}
}

// --- Internal ---

const registerCommand = (params: P) => {
	const handler = commandHandler(params)

	params.commands.on<cmd.user.signOut>("user.sign-out", handler)

	return () => {
		params.commands.off<cmd.user.signOut>("user.sign-out", handler)
	}
}

const registerCommandPalette = ({ commands }: P) => {
	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "user.sign-out",
		readableName: "Выйти из аккаунта",
		Icon: AiOutlineLogout,
		onSelect: () => {
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
			commands.emit<cmd.user.signOut>("user.sign-out")
		},
	})

	return () => {
		commands.emit<cmd.commandPalette.remove>("command-palette.remove", "user.sign-out")
	}
}

const commandHandler =
	({ commands, websiteHost }: P) =>
	() =>
		commands.emit<cmd.router.openExternal>("router.open-external", {
			url: `${websiteHost}/sign-out`,
			newTab: false,
		})
