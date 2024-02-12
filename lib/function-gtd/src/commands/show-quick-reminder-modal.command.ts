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
	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: COMMAND_NAME,
		Icon: BsInbox,
		readableName: "Создать задачу во Входящих",
		accelerator: "meta+shift+n",
		onSelect: () => {
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
			commands.emit<cmd.gtd.showQuickReminderModal>(COMMAND_NAME)
		},
	})

	return () => {
		commands.emit<cmd.commandPalette.remove>("command-palette.remove", COMMAND_NAME)
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
