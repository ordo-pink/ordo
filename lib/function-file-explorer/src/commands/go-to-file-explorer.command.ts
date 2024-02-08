import { BsFolder2Open } from "react-icons/bs"

type P = { commands: Client.Commands.Commands }
export const registerGoToFileExplorerCommand = (params: P) => {
	const unregisterCommand = registerCommand(params)
	const unregisterCommandPalette = registerCommandPalette(params)

	return () => {
		unregisterCommand()
		unregisterCommandPalette()
	}
}

// --- Internal ---

const registerCommand = (params: P) => {
	params.commands.on<cmd.fileExplorer.goToFileExplorer>(
		"file-explorer.go-to-file-explorer",
		commandHandler(params),
	)

	return () => {
		params.commands.off<cmd.fileExplorer.goToFileExplorer>(
			"file-explorer.go-to-file-explorer",
			commandHandler(params),
		)
	}
}

const registerCommandPalette = ({ commands }: P) => {
	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "file-explorer.go-to-file-explorer",
		Icon: BsFolder2Open,
		onSelect: () => {
			commands.emit<cmd.fileExplorer.goToFileExplorer>("file-explorer.go-to-file-explorer")
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
		},
		readableName: "Открыть файловый менеджер",
		accelerator: "mod+shift+e",
	})

	return () => {
		commands.emit<cmd.commandPalette.remove>(
			"command-palette.remove",
			"file-explorer.go-to-file-explorer",
		)
	}
}

const commandHandler =
	({ commands }: P) =>
	() =>
		commands.emit<cmd.router.navigate>("router.navigate", "/fs")
