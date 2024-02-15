import { AiOutlineLogout } from "react-icons/ai"

type P = { commands: Client.Commands.Commands; websiteHost: string }
export const registerSignOutCommand = (params: P) => {
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

	params.commands.on<cmd.user.signOut>("user.sign-out", handler)

	return () => {
		params.commands.off<cmd.user.signOut>("user.sign-out", handler)
	}
}

const registerCommandPalette = ({ commands }: P) => {
	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "user.sign-out",
		readableName: "Выйти из аккаунта",
		Icon: AiOutlineLogout,
		onSelect: () => {
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
			commands.emit<cmd.user.signOut>("user.sign-out")
		},
	})

	return () => {
		commands.emit<cmd.commandPalette.remove>("command-palette.remove", "user.sign-out")
	}
}

const commandHandler =
	({ commands, websiteHost }: P) =>
	() =>
		commands.emit<cmd.router.openExternal>("router.open-external", {
			url: `${websiteHost}/sign-out`,
			newTab: false,
		})
