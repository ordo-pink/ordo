// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Router } from "silkrouter"
import { Unary, callOnce } from "@ordo-pink/tau/mod"
import { Logger } from "@ordo-pink/logger/mod"
import { getCommands } from "$streams/commands"
import { cmd } from "@ordo-pink/libfe/mod"

// TODO: Consider moving to react-router

const commands = getCommands()

export const __initRouter: InitRouter = callOnce(({ logger }) => {
	logger.debug("Initializing router")

	commands.on<cmd.router.navigate>("router.navigate", ({ payload }) => {
		logger.debug("Navigating to", payload)

		if (Array.isArray(payload)) {
			router$.set(...(payload as [string]))
			return
		}

		router$.set(payload)
	})

	commands.on<cmd.router.openExternal>(
		"router.open-external",
		({ payload: { url, newTab = true } }) => {
			logger.debug("Opening external page", { url, newTab })
			newTab ? window.open(url, "_blank")?.focus() : (window.location.href = url)
		}
	)

	return { router$ }
})

type InitRouterP = { logger: Logger }
type InitRouterR = { router$: Router }
type InitRouter = Unary<InitRouterP, InitRouterR>

const router$ = new Router({ hashRouting: false, init: true })
