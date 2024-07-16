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

import { BsCollection } from "react-icons/bs"

type P = { commands: Client.Commands.Commands }
export const registerGoToHomeCommand = (params: P) => {
	const unregisterCommand = registerCommand(params)
	const unregisterCommandPalette = registerCommandPalette(params)

	return () => {
		unregisterCommand()
		unregisterCommandPalette()
	}
}

// --- Internal ---

const registerCommand = (params: P) => {
	params.commands.on<cmd.home.goToHome>("home.go-to-home", commandHandler(params))

	return () => {
		params.commands.off<cmd.home.goToHome>("home.go-to-home", commandHandler(params))
	}
}

const registerCommandPalette = ({ commands }: P) => {
	commands.emit<cmd.command_palette.add>("command-palette.add", {
		id: "home.go-to-home",
		Icon: BsCollection,
		on_select: () => {
			commands.emit<cmd.home.goToHome>("home.go-to-home")
			commands.emit<cmd.command_palette.hide>("command-palette.hide")
		},
		readable_name: "Открыть главную страницу",
		accelerator: "mod+h",
	})

	return () => {
		commands.emit<cmd.command_palette.remove>("command-palette.remove", "home.go-to-home")
	}
}

const commandHandler =
	({ commands }: P) =>
	() =>
		commands.emit<cmd.router.navigate>("router.navigate", "/")
