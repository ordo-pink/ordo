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

import { BsTag } from "react-icons/bs"

import { DataProviders } from "@ordo-pink/frontend-create-function"

type P = { commands: Client.Commands.Commands; data: DataProviders }
export const registerShowLabelInLinksCommand = (params: P) => {
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

	params.commands.on<cmd.links.showLabelLinks>("links.show-label-links", handler)

	return () => {
		params.commands.off<cmd.links.showLabelLinks>("links.show-label-links", handler)
	}
}

const registerCommandPalette = ({ commands }: P) => {
	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "links.show-label-links",
		Icon: BsTag,
		onSelect: () => {
			commands.emit<cmd.links.showLabelLinks>("links.show-label-links")
		},
		readableName: "Показать связи с меткой...",
	})

	return () => {
		commands.emit<cmd.commandPalette.remove>("command-palette.remove", "links.show-label-links")
	}
}

const commandHandler =
	({ commands, data }: P) =>
	() => {
		const labels = data.getDataLabels()

		commands.emit<cmd.commandPalette.show>("command-palette.show", {
			items: labels.map(label => ({
				id: label,
				readableName: label,
				Icon: BsTag,
				onSelect: () => {
					commands.emit<cmd.router.navigate>("router.navigate", `/links/labels/${label}`)
					commands.emit<cmd.commandPalette.hide>("command-palette.hide")
				},
			})),
		})
	}
