/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import node_fs from "node:fs"
import node_path from "node:path"

import { Oath } from "@ordo-pink/oath"
import { noop } from "@ordo-pink/tau"
import { run_async_command } from "@ordo-pink/binutil"

export const run_bin_for_each_srv = async (bin_name: string): Promise<void> => {
	const srvs = await node_fs.promises.readdir("srv")

	return Oath.Merge(
		srvs.map(srv => {
			const path = node_path.join("srv", srv, "bin", `${bin_name}.ts`)
			return Oath.FromPromise(() => node_fs.promises.exists(path))
				.fix(() => null)
				.and(() => run_async_command(`opt/bun ${path}`, { stderr: "pipe", stdout: "pipe" }))
		}),
	).fork(console.error, noop)
}
