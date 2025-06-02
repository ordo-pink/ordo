/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { CommandHandler } from "@ordo-pink/cmd-handler"
import { run_bin_for_each_srv } from "@ordo-pink/cmd-run-bin-for-each-srv"

export const run_command: CommandHandler.Commands = {
	run: {
		help: "Runs all SRVs in a single terminal session.",
		handler: () => run_bin_for_each_srv("run"),
	},
}
