// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { BsChat } from "react-icons/bs"
import { lazy } from "react"

import { createFunction } from "@ordo-pink/create-function"

export default createFunction(
	"com.the.test",
	{ queries: ["auth.is-authenticated"], commands: ["hello.world", "activities.add"] },
	({ getCommands, getLogger, getIsAuthenticated }) => {
		const commands = getCommands()
		const logger = getLogger()
		const isAuth = getIsAuthenticated()

		const handleHelloWorld = () => logger.info("Authentication status", isAuth)

		commands.on("hello.world", handleHelloWorld)

		commands.emit("hello.world")

		commands.emit<cmd.activities.add>("activities.add", {
			background: false,
			name: "test",
			routes: ["/"],
			Sidebar: lazy(() => import("./src/sidebar.component") as any),
			Component: lazy(() => import("./src/workspace.component") as any),
			Icon: BsChat,
		})

		return () => {
			commands.off("hello.world", handleHelloWorld)
		}
	},
)
