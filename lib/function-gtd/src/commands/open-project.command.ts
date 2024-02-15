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
	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: COMMAND_NAME,
		Icon: BsUiChecks,
		readableName: "Октрыть в задачах",
		type: "read",
		shouldShow: ({ payload }) =>
			Either.fromNullable(payload as PlainData | null)
				.chain(Data.Validations.isValidDataE)
				.chain(({ fsid }) => GTDRepository.getClosestProjectE(data.getData(), fsid))
				.fold(F, T),
		accelerator: "mod+i",
		payloadCreator: ({ payload }) => (payload as PlainData)?.fsid,
	})

	return () => {
		commands.emit<cmd.ctxMenu.remove>("context-menu.remove", COMMAND_NAME)
	}
}

const registerCommandPalette = ({ commands, data }: P) => {
	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: COMMAND_NAME,
		Icon: BsUiChecks,
		readableName: "Открыть проект в задачах...",
		accelerator: "meta+i",
		onSelect: () => {
			const allData = data.getData()
			const projects = GTDRepository.getProjects(allData)
			const items = projects.map(project => ({
				id: project.fsid,
				readableName: project.name,
				Icon: BsUiChecks,
				onSelect: () => {
					commands.emit<cmd.commandPalette.hide>("command-palette.hide")
					commands.emit<cmd.gtd.openProject>("gtd.open-project", project.fsid)
				},
			}))

			commands.emit<cmd.commandPalette.show>("command-palette.show", { items, multiple: false })
		},
	})

	return () => {
		commands.emit<cmd.commandPalette.remove>("command-palette.remove", COMMAND_NAME)
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
