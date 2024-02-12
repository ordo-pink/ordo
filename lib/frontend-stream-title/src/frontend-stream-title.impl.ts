// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { BehaviorSubject } from "rxjs/internal/BehaviorSubject"

import { callOnce } from "@ordo-pink/tau"
import { getCommands } from "@ordo-pink/frontend-stream-commands"
import { getLogger } from "@ordo-pink/frontend-logger"

export const __initTitle = callOnce((fid: symbol) => {
	const commands = getCommands(fid)
	const logger = getLogger(fid)

	logger.debug("Initialising title...")

	commands.on<cmd.application.setTitle>("application.set-title", title =>
		title$.next(`${title} | Ordo.pink`),
	)

	logger.debug("Initialised title.")
})

export const title$ = new BehaviorSubject<string>("Ordo.pink")
