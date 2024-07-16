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

import Component from "../components/quick-reminder-modal.component"

const COMMAND_NAME = "gtd.show-quick-reminder-modal"

type P = { commands: Client.Commands.Commands }
export const registerShowQuickReminderModalCmd = ({ commands }: P) => {
	const dropCommand = registerCommand({ commands })
	const dropCommandPalette = registerCommandPalette({ commands })

	return () => {
		dropCommand()
		dropCommandPalette()
	}
}

const registerCommandPalette = ({ commands }: P) => {
	commands.emit<cmd.command_palette.add>("command-palette.add", {
		id: COMMAND_NAME,
		Icon: BsInbox,
		readable_name: "Создать задачу во Входящих",
		accelerator: "meta+shift+n",
		on_select: () => {
			commands.emit<cmd.command_palette.hide>("command-palette.hide")
			commands.emit<cmd.gtd.showQuickReminderModal>(COMMAND_NAME)
		},
	})

	return () => {
		commands.emit<cmd.command_palette.remove>("command-palette.remove", COMMAND_NAME)
	}
}

const registerCommand = ({ commands }: P) => {
	const handler = handle({ commands })

	commands.on<cmd.gtd.showQuickReminderModal>(COMMAND_NAME, handler)

	return () => {
		commands.off<cmd.gtd.showQuickReminderModal>(COMMAND_NAME, handler)
	}
}

const handle =
	({ commands }: P) =>
	() =>
		commands.emit<cmd.modal.show>("modal.show", { Component })
