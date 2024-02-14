import { BsLayoutSidebar } from "react-icons/bs"

const COMMAND_NAME = "editor.go-to-editor"

type P = { commands: Client.Commands.Commands }
export const registerGoToEditorCommand = (params: P) => {
	const unregisterCommand = registerCommand(params)
	const unregisterCommandPalette = registerCommandPalette(params)

	return () => {
		unregisterCommand()
		unregisterCommandPalette()
	}
}

// --- Internal ---

const registerCommand = ({ commands }: P) => {
	const handler = () => commands.emit<cmd.router.navigate>("router.navigate", "/editor")

	commands.on<cmd.editor.goToEditor>(COMMAND_NAME, handler)

	return () => {
		commands.off<cmd.editor.goToEditor>(COMMAND_NAME, handler)
	}
}

const registerCommandPalette = ({ commands }: P) => {
	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: COMMAND_NAME,
		Icon: BsLayoutSidebar,
		onSelect: () => {
			commands.emit<cmd.editor.goToEditor>(COMMAND_NAME)
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
		},
		readableName: "Открыть редактор",
		accelerator: "mod+e",
	})

	return () => {
		commands.emit<cmd.commandPalette.remove>("command-palette.remove", COMMAND_NAME)
	}
}
