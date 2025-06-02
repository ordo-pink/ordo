/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { CommandHandler } from "@ordo-pink/cmd-handler"
import { run_bin_for_each_srv } from "@ordo-pink/cmd-run-bin-for-each-srv"

export const init_command: CommandHandler.Commands = {
	init: {
		help: "Initialise every SRV using their 'bin/init.ts' instructions.",
		handler: () => run_bin_for_each_srv("init"),
	},
}
