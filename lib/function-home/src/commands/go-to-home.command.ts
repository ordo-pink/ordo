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
	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "home.go-to-home",
		Icon: BsCollection,
		onSelect: () => {
			commands.emit<cmd.home.goToHome>("home.go-to-home")
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
		},
		readableName: "Открыть главную страницу",
		accelerator: "mod+h",
	})

	return () => {
		commands.emit<cmd.commandPalette.remove>("command-palette.remove", "home.go-to-home")
	}
}

const commandHandler =
	({ commands }: P) =>
	() =>
		commands.emit<cmd.router.navigate>("router.navigate", "/")
