import { PiGraph } from "react-icons/pi"

type P = { commands: Client.Commands.Commands }
export const registerGoToLinksCommand = (params: P) => {
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

	params.commands.on<cmd.links.goToLinks>("links.go-to-links", handler)

	return () => {
		params.commands.off<cmd.links.goToLinks>("links.go-to-links", handler)
	}
}

const registerCommandPalette = ({ commands }: P) => {
	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "links.go-to-links",
		Icon: PiGraph,
		onSelect: () => {
			commands.emit<cmd.links.goToLinks>("links.go-to-links")
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
		},
		readableName: "Открыть связи",
		accelerator: "mod+shift+l",
	})

	return () => {
		commands.emit<cmd.commandPalette.remove>("command-palette.remove", "links.go-to-links")
	}
}

const commandHandler =
	({ commands }: P) =>
	() =>
		commands.emit<cmd.router.navigate>("router.navigate", "/links")
