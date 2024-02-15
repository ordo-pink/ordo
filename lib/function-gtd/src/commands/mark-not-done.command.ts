import { F, T } from "ramda"
import { BsSquare } from "react-icons/bs"

import { Data, FSID, PlainData } from "@ordo-pink/data"
import { DataProviders } from "@ordo-pink/frontend-create-function"
import { Either } from "@ordo-pink/either"
import { noop } from "@ordo-pink/tau"

import { GTDRepository } from "../gtd.repository"
import { GTD_DONE_LABEL } from "../gtd.constants"

const COMMAND_NAME = "gtd.mark-not-done"

type P = { commands: Client.Commands.Commands; data: DataProviders }
export const registerMarkNotDoneCmd = ({ commands, data }: P) => {
	const dropCommand = registerCommand({ commands, data })
	const dropContextMenu = registerContextMenu({ commands, data })

	return () => {
		dropCommand()
		dropContextMenu()
	}
}

const registerContextMenu = ({ commands, data }: P) => {
	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: COMMAND_NAME,
		Icon: BsSquare,
		readableName: "Отметить как невыполненное",
		type: "update",
		shouldShow: ({ payload }) =>
			Data.Validations.isValidDataE(payload as PlainData)
				.chain(plain =>
					GTDRepository.getClosestProjectE(data.getData(), plain.fsid)
						.chain(Either.fromNullable)
						.chain(() =>
							Either.fromBoolean(
								() => GTDRepository.isDone(plain),
								() => plain,
							),
						),
				)

				.fold(F, T),
		accelerator: "mod+1",
		payloadCreator: ({ payload }) => (payload as PlainData).fsid,
	})

	return () => {
		commands.emit<cmd.ctxMenu.remove>("context-menu.remove", COMMAND_NAME)
	}
}

const registerCommand = ({ commands, data }: P) => {
	const handler = handle({ commands, data })

	commands.on<cmd.gtd.markNotDone>(COMMAND_NAME, handler)

	return () => {
		commands.off<cmd.gtd.markNotDone>(COMMAND_NAME, handler)
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
			.fold(noop, item =>
				commands.emit<cmd.data.removeLabel>("data.remove-label", {
					item,
					label: GTD_DONE_LABEL,
				}),
			)
