// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
	commands.emit<cmd.command_palette.add>("command-palette.add", {
		id: "home.open-support",
		Icon: BsLifePreserver,
		on_select: () => {
			commands.emit<cmd.home.openSupport>("home.open-support")
		},
		readable_name: "Обратиться в поддержку...",
		accelerator: "mod+f1",
	})

	return () => {
		commands.emit<cmd.command_palette.remove>("command-palette.remove", "home.open-support")
	}
}

const emailHandler =
	({ commands }: P) =>
	() =>
		commands.emit<cmd.router.open_external>("router.open_external", {
			new_tab: true,
			url: "mailto:support@ordo.pink",
		})

const telegramHandler =
	({ commands }: P) =>
	() =>
		commands.emit<cmd.router.open_external>("router.open_external", {
			new_tab: true,
			url: "https://t.me/ordo_pink_ru/190",
		})

const supportHandler =
	({ commands }: P) =>
	() =>
		commands.emit<cmd.command_palette.show>("command-palette.show", {
			items: [
				{
					id: "home.open-telegram-support",
					Icon: BsTelegram,
					readable_name: "Telegram",
					accelerator: "t",
					on_select: () => {
						commands.emit<cmd.command_palette.hide>("command-palette.hide")
						commands.emit<cmd.home.openTelegramSupport>("home.open-telegram-support")
					},
				},
				{
					id: "home.open-email-support",
					Icon: BsEnvelope,
					readable_name: "Email",
					accelerator: "e",
					on_select: () => {
						commands.emit<cmd.command_palette.hide>("command-palette.hide")
						commands.emit<cmd.home.openEmailSupport>("home.open-email-support")
					},
				},
			],
		})
