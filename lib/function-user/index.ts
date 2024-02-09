// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { AiOutlineLogout } from "react-icons/ai"
import { BsPersonCircle } from "react-icons/bs"
import { lazy } from "react"

import { createFunction } from "@ordo-pink/frontend-create-function"

export default createFunction(
	"pink.ordo.user",
	{ queries: [], commands: [] },
	({ getCommands, getHosts }) => {
		const commands = getCommands()
		const { websiteHost } = getHosts()

		commands.emit<cmd.activities.add>("activities.add", {
			Component: lazy(() => import("./src/user.workspace") as any),
			name: "user",
			routes: ["/user"],
			background: true,
		})

		commands.on<cmd.user.goToAccount>("user.go-to-account", () =>
			commands.emit<cmd.router.navigate>("router.navigate", "/user"),
		)

		commands.on<cmd.user.signOut>("user.sign-out", () =>
			commands.emit<cmd.router.openExternal>("router.open-external", {
				url: `${websiteHost}/sign-out`,
				newTab: false,
			}),
		)

		commands.emit<cmd.commandPalette.add>("command-palette.add", {
			id: "user.go-to-user",
			readableName: "Аккаунт",
			Icon: BsPersonCircle,
			onSelect: () => {
				commands.emit<cmd.commandPalette.hide>("command-palette.hide")
				commands.emit<cmd.user.goToAccount>("user.go-to-account")
			},
		})

		commands.emit<cmd.commandPalette.add>("command-palette.add", {
			id: "core.sign-out",
			readableName: "Выйти",
			Icon: AiOutlineLogout,
			onSelect: () => {
				commands.emit<cmd.commandPalette.hide>("command-palette.hide")
				commands.emit<cmd.user.signOut>("user.sign-out")
			},
		})
	},
)
