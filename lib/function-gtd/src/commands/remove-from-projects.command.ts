import { F, T } from "ramda"
import { BsJournalMinus } from "react-icons/bs"

import { Data, FSID, PlainData } from "@ordo-pink/data"
import { DataProviders } from "@ordo-pink/frontend-create-function"
import { Either } from "@ordo-pink/either"
import { noop } from "@ordo-pink/tau"

import { GTD_LABEL, GTD_PROJECT_LABEL } from "../gtd.constants"
import { GTDRepository } from "../gtd.repository"

const COMMAND_NAME = "gtd.remove-from-projects"

type P = { commands: Client.Commands.Commands; data: DataProviders }
export const registerRemoveFromProjectsCmd = ({ commands, data }: P) => {
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
	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: COMMAND_NAME,
		Icon: BsJournalMinus,
		readableName: "Убрать из проектов в задачах...",
		accelerator: "mod+meta+g",
		onSelect: () => {
			const nonProjects = data.selectDataList(GTDRepository.isProject)
			const items = nonProjects.map(project => ({
				id: project.fsid,
				readableName: project.name,
				Icon: BsJournalMinus,
				onSelect: () => {
					commands.emit<cmd.commandPalette.hide>("command-palette.hide")
					commands.emit<cmd.gtd.removeFromProjects>(COMMAND_NAME, project.fsid)
				},
			}))

			commands.emit<cmd.commandPalette.show>("command-palette.show", { items, multiple: false })
		},
	})

	return () => {
		commands.emit<cmd.commandPalette.remove>("command-palette.remove", COMMAND_NAME)
	}
}

const registerContextMenu = ({ commands }: P) => {
	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: COMMAND_NAME,
		Icon: BsJournalMinus,
		readableName: "Удалить из проектов в задачах",
		type: "delete",
		shouldShow: ({ payload }) =>
			Data.Validations.isValidDataE(payload as PlainData)
				.chain(plain =>
					Either.fromBoolean(
						() => GTDRepository.isProject(plain),
						() => plain,
					),
				)
				.fold(F, T),
		accelerator: "mod+g",
		payloadCreator: ({ payload }) => (payload as PlainData).fsid,
	})

	return () => {
		commands.emit<cmd.ctxMenu.remove>("context-menu.remove", COMMAND_NAME)
	}
}

const registerCommand = ({ commands, data }: P) => {
	const handler = handle({ commands, data })

	commands.on<cmd.gtd.removeFromProjects>(COMMAND_NAME, handler)

	return () => {
		commands.off<cmd.gtd.removeFromProjects>(COMMAND_NAME, handler)
	}
}

const handle =
	({ commands, data }: P) =>
	(fsid: FSID) =>
		Either.fromNullable(data.getDataByFSID(fsid))
			.chain(data =>
				Either.fromBoolean(
					() => GTDRepository.isProject(data),
					() => data,
				),
			)
			.fold(noop, item =>
				commands.emit<cmd.data.removeLabel>("data.remove-label", {
					item,
					label: [GTD_LABEL, GTD_PROJECT_LABEL],
				}),
			)
