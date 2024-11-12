// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import {
	check_files_exist,
	dirents_to_dirs,
	get_dirent_names,
	get_existing_paths,
	run_async_command,
} from "@ordo-pink/binutil"
import { noop } from "@ordo-pink/tau"
import { readdir0 } from "@ordo-pink/fs"

export const run = () =>
	readdir0("./srv", { withFileTypes: true })
		.pipe(ops0.map(dirents_to_dirs))
		.pipe(ops0.map(get_dirent_names))
		.pipe(ops0.map(names => names.map(name => `./srv/${name}/bin/run.ts`)))
		.pipe(ops0.chain(check_files_exist))
		.pipe(ops0.map(get_existing_paths))
		.pipe(
			ops0.chain(paths =>
				Oath.Merge(
					paths.map(path =>
						run_async_command(`opt/bun run ${path}`, { stdout: "pipe", stderr: "pipe" }),
					),
				).pipe(ops0.map(noop)),
			),
		)
		.invoke(invokers0.or_else(console.error))
