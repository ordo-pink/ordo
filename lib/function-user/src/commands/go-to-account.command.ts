import { BsPersonCircle } from "react-icons/bs"

type P = { commands: Client.Commands.Commands }
export const registerGoToAccountCommand = (params: P) => {
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

	params.commands.on<cmd.user.goToAccount>("user.go-to-account", handler)

	return () => {
		params.commands.off<cmd.user.goToAccount>("user.go-to-account", handler)
	}
}

const registerCommandPalette = ({ commands }: P) => {
	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "user.go-to-account",
		readableName: "Открыть аккаунт",
		Icon: BsPersonCircle,
		onSelect: () => {
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
			commands.emit<cmd.user.goToAccount>("user.go-to-account")
		},
	})

	return () => {
		commands.emit<cmd.commandPalette.remove>("command-palette.remove", "user.go-to-account")
	}
}

const commandHandler =
	({ commands }: P) =>
	() =>
		commands.emit<cmd.router.navigate>("router.navigate", "/user")
