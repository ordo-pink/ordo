import { BsInbox } from "react-icons/bs"

const COMMAND_NAME = "gtd.open-inbox"

type P = { commands: Client.Commands.Commands }
export const registerOpenInboxCmd = ({ commands }: P) => {
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
		readableName: "Открыть задачи",
		accelerator: "meta+shift+i",
		onSelect: () => {
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
			commands.emit<cmd.gtd.openInbox>(COMMAND_NAME)
		},
	})

	return () => {
		commands.emit<cmd.commandPalette.remove>("command-palette.remove", COMMAND_NAME)
	}
}

const registerCommand = ({ commands }: P) => {
	const handler = handle({ commands })

	commands.on<cmd.gtd.openInbox>(COMMAND_NAME, handler)

	return () => {
		commands.off<cmd.gtd.openInbox>(COMMAND_NAME, handler)
	}
}

const handle =
	({ commands }: P) =>
	() =>
		commands.emit<cmd.router.navigate>("router.navigate", "/gtd")
