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
import { BsJournalPlus } from "react-icons/bs"

import { Data, FSID, PlainData } from "@ordo-pink/data"
import { DataProviders } from "@ordo-pink/frontend-create-function"
import { Either } from "@ordo-pink/either"
import { noop } from "@ordo-pink/tau"

import { GTD_INBOX_LABEL, GTD_LABEL, GTD_PROJECT_LABEL } from "../gtd.constants"
import { GTDRepository } from "../gtd.repository"

const COMMAND_NAME = "gtd.add-to-projects"

type P = { commands: Client.Commands.Commands; data: DataProviders }
export const registerAddToProjectsCmd = ({ commands, data }: P) => {
	const dropCommand = registerCommand({ commands, data })
	const dropContextMenu = registerContextMenu({ commands, data })
	const dropCommandPalette = registerCommandPalette({ commands, data })

	return () => {
		dropCommand()
		dropContextMenu()
		dropCommandPalette()
	}
}

const registerCommandPalette = ({ commands, data }: P) => {
	commands.emit<cmd.command_palette.add>("command-palette.add", {
		id: COMMAND_NAME,
		Icon: BsJournalPlus,
		readable_name: "Добавить в проекты в задачах...",
		accelerator: "mod+shift+g",
		on_select: () => {
			const nonProjects = data.selectDataList(item => !GTDRepository.isProject(item))
			const items = nonProjects.map(project => ({
				id: project.fsid,
				readableName: project.name,
				Icon: BsJournalPlus,
				onSelect: () => {
					commands.emit<cmd.command_palette.hide>("command-palette.hide")
					commands.emit<cmd.gtd.addToProjects>(COMMAND_NAME, project.fsid)
				},
			}))

			commands.emit<cmd.command_palette.show>("command-palette.show", { items, multiple: false })
		},
	})

	return () => {
		commands.emit<cmd.command_palette.remove>("command-palette.remove", COMMAND_NAME)
	}
}

const registerContextMenu = ({ commands }: P) => {
	commands.emit<cmd.ctx_menu.add>("context-menu.add", {
		cmd: COMMAND_NAME,
		Icon: BsJournalPlus,
		readable_name: "Создать проект в задачах",
		type: "create",
		should_show: ({ payload }) =>
			Data.Validations.isValidDataE(payload as PlainData)
				.chain(plain =>
					Either.fromBoolean(
						() => !GTDRepository.isProject(plain),
						() => plain,
					),
				)
				.fold(F, T),
		accelerator: "mod+g",
		payload_creator: ({ payload }) => (payload as PlainData).fsid,
	})

	return () => {
		commands.emit<cmd.ctx_menu.remove>("context-menu.remove", COMMAND_NAME)
	}
}

const registerCommand = ({ commands, data }: P) => {
	const handler = handle({ commands, data })

	commands.on<cmd.gtd.addToProjects>(COMMAND_NAME, handler)

	return () => {
		commands.off<cmd.gtd.addToProjects>(COMMAND_NAME, handler)
	}
}

const handle =
	({ commands, data }: P) =>
	(fsid: FSID) =>
		Either.fromNullable(data.getDataByFSID(fsid))
			.chain(data =>
				Either.fromBoolean(
					() => !GTDRepository.isProject(data),
					() => data,
				),
			)
			.fold(noop, item => {
				if (item.labels.includes(GTD_INBOX_LABEL)) {
					commands.emit<cmd.data.metadata.remove_labels>("data.metadata.remove_label", {
						item,
						labels: [GTD_INBOX_LABEL],
					})
				}

				commands.emit<cmd.data.add_labels>("data.metadata.add_label", {
					item,
					labels: [GTD_LABEL, GTD_PROJECT_LABEL],
				})
			})
