import { BsEnvelope, BsLifePreserver, BsTelegram } from "react-icons/bs"

type P = { commands: Client.Commands.Commands }
export const registerSupportCommand = (params: P) => {
	const unregisterCommand = registerCommand(params)
	const unregisterCommandPalette = registerCommandPalette(params)

	return () => {
		unregisterCommand()
		unregisterCommandPalette()
	}
}

// --- Internal ---

const registerCommand = (params: P) => {
	const handleEmail = emailHandler(params)
	const handleTg = telegramHandler(params)
	const handleSupport = supportHandler(params)

	params.commands.on<cmd.home.openEmailSupport>("home.open-email-support", handleEmail)
	params.commands.on<cmd.home.openTelegramSupport>("home.open-telegram-support", handleTg)
	params.commands.on<cmd.home.openSupport>("home.open-support", handleSupport)

	return () => {
		params.commands.off<cmd.home.openEmailSupport>("home.open-email-support", handleEmail)
		params.commands.off<cmd.home.openTelegramSupport>("home.open-telegram-support", handleTg)
		params.commands.off<cmd.home.openSupport>("home.open-support", handleSupport)
	}
}

const registerCommandPalette = ({ commands }: P) => {
	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "home.open-support",
		Icon: BsLifePreserver,
		onSelect: () => {
			commands.emit<cmd.home.openSupport>("home.open-support")
		},
		readableName: "Обратиться в поддержку...",
		accelerator: "mod+f1",
	})

	return () => {
		commands.emit<cmd.commandPalette.remove>("command-palette.remove", "home.open-support")
	}
}

const emailHandler =
	({ commands }: P) =>
	() =>
		commands.emit<cmd.router.openExternal>("router.open-external", {
			newTab: true,
			url: "mailto:support@ordo.pink",
		})

const telegramHandler =
	({ commands }: P) =>
	() =>
		commands.emit<cmd.router.openExternal>("router.open-external", {
			newTab: true,
			url: "https://t.me/ordo_pink_ru/190",
		})

const supportHandler =
	({ commands }: P) =>
	() =>
		commands.emit<cmd.commandPalette.show>("command-palette.show", {
			items: [
				{
					id: "home.open-telegram-support",
					Icon: BsTelegram,
					readableName: "Telegram",
					accelerator: "t",
					onSelect: () => {
						commands.emit<cmd.commandPalette.hide>("command-palette.hide")
						commands.emit<cmd.home.openTelegramSupport>("home.open-telegram-support")
					},
				},
				{
					id: "home.open-email-support",
					Icon: BsEnvelope,
					readableName: "Email",
					accelerator: "e",
					onSelect: () => {
						commands.emit<cmd.commandPalette.hide>("command-palette.hide")
						commands.emit<cmd.home.openEmailSupport>("home.open-email-support")
					},
				},
			],
		})
