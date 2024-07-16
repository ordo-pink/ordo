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

import { F, T } from "ramda"
import { BsUiChecks } from "react-icons/bs"

import { Data, type FSID, type PlainData } from "@ordo-pink/data"
import { type DataProviders } from "@ordo-pink/frontend-create-function"
import { Either } from "@ordo-pink/either"
import { noop } from "@ordo-pink/tau"

import { GTDRepository } from "../gtd.repository"

const COMMAND_NAME = "gtd.open-project"

type P = { commands: Client.Commands.Commands; data: DataProviders }
export const registerOpenProjectCmd = ({ commands, data }: P) => {
	const dropCommand = registerCommand({ commands, data })
	const dropContextMenu = registerContextMenu({ commands, data })
	const dropCommandPalette = registerCommandPalette({ commands, data })

	return () => {
		dropCommand()
		dropContextMenu()
		dropCommandPalette()
	}
}

const registerContextMenu = ({ commands, data }: P) => {
	commands.emit<cmd.ctx_menu.add>("context-menu.add", {
		cmd: COMMAND_NAME,
		Icon: BsUiChecks,
		readable_name: "Октрыть в задачах",
		type: "read",
		should_show: ({ payload }) =>
			Either.fromNullable(payload as PlainData | null)
				.chain(Data.Validations.isValidDataE)
				.chain(({ fsid }) => GTDRepository.getClosestProjectE(data.getData(), fsid))
				.fold(F, T),
		accelerator: "mod+i",
		payload_creator: ({ payload }) => (payload as PlainData)?.fsid,
	})

	return () => {
		commands.emit<cmd.ctx_menu.remove>("context-menu.remove", COMMAND_NAME)
	}
}

const registerCommandPalette = ({ commands, data }: P) => {
	commands.emit<cmd.command_palette.add>("command-palette.add", {
		id: COMMAND_NAME,
		Icon: BsUiChecks,
		readable_name: "Открыть проект в задачах...",
		accelerator: "meta+i",
		on_select: () => {
			const allData = data.getData()
			const projects = GTDRepository.getProjects(allData)
			const items = projects.map(project => ({
				id: project.fsid,
				readableName: project.name,
				Icon: BsUiChecks,
				onSelect: () => {
					commands.emit<cmd.command_palette.hide>("command-palette.hide")
					commands.emit<cmd.gtd.openProject>("gtd.open-project", project.fsid)
				},
			}))

			commands.emit<cmd.command_palette.show>("command-palette.show", { items, multiple: false })
		},
	})

	return () => {
		commands.emit<cmd.command_palette.remove>("command-palette.remove", COMMAND_NAME)
	}
}

const registerCommand = ({ commands, data }: P) => {
	const handler = handle({ commands, data })

	commands.on<cmd.gtd.openProject>(COMMAND_NAME, handler)

	return () => {
		commands.off<cmd.gtd.openProject>(COMMAND_NAME, handler)
	}
}

const handle =
	({ commands, data }: P) =>
	(fsid: FSID) => {
		GTDRepository.getClosestProjectE(data.getData(), fsid).fold(noop, item =>
			commands.emit<cmd.router.navigate>("router.navigate", `/gtd/projects/${item.fsid}`),
		)
	}
