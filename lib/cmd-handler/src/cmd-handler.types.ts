/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { GetOpts } from "@ordo-pink/cmd-get-opts"

export namespace CommandHandler {
	export type Fn = (opts: GetOpts.Opts) => void | Promise<void>

	export type Name = string & {}

	export type Command = {
		handler: CommandHandler.Fn
		help: string
	}

	export type Commands = Record<CommandHandler.Name, CommandHandler.Command>
}
