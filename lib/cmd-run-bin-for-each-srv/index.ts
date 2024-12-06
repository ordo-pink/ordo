/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import node_fs from "node:fs"
import node_path from "node:path"

import { noop } from "@ordo-pink/tau"
import { run_async_command } from "@ordo-pink/binutil"

export const run_bin_for_each_srv = async (bin_name: string): Promise<void> => {
	const srvs = await node_fs.promises.readdir("srv")

	for (const srv of srvs) {
		const path = node_path.join("srv", srv, "bin", `${bin_name}.ts`)
		const command_exists = await node_fs.promises.exists(path)

		if (!command_exists) continue

		void run_async_command(`opt/bun ${path}`, { stderr: "pipe", stdout: "pipe" }).fork(console.error, noop)
	}
}
