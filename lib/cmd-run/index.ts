/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { TCommandRecord } from "@ordo-pink/binutil"
import { run_bin_for_each_srv } from "@ordo-pink/cmd-run-bin-for-each-srv"

export const run_command: TCommandRecord = {
	run: {
		help: "Runs all SRVs in a single terminal session.",
		handler: () => run_bin_for_each_srv("run"),
	},
}
