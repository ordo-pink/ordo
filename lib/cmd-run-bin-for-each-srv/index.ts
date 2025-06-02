/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import node_fs from "node:fs"
import node_path from "node:path"

import { noop } from "@ordo-pink/tau"
import { oath } from "@ordo-pink/oath"
import { run_async_command } from "@ordo-pink/cmd-runner"

export const run_bin_for_each_srv = async (bin_name: string): Promise<void> => {
	const srvs = await node_fs.promises.readdir("srv")

	return oath
		.all(
			srvs.map(srv => {
				const path = node_path.join("srv", srv, "bin", `${bin_name}.ts`)

				return oath
					.from_promise(() => node_fs.promises.exists(path))
					.pipe(oath.ops.chain(exists => oath.if(exists)))
					.pipe(oath.ops.chain(() => run_async_command(`opt/bun ${path}`, { stderr: "pipe", stdout: "pipe" })))
					.pipe(oath.ops.fix(() => null))
			}),
		)
		.cata({ reject: console.error, resolve: noop })
}
