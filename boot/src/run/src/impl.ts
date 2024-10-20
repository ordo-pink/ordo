// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import {
	check_files_exist,
	dirents_to_dirs,
	get_existing_paths,
	get_dirent_names,
	run_async_command,
} from "@ordo-pink/binutil"
import { Oath } from "@ordo-pink/oath"
import { noop } from "@ordo-pink/tau"
import { readdir0 } from "@ordo-pink/fs"

export const run = () =>
	readdir0("./srv", { withFileTypes: true })
		.map(dirents_to_dirs)
		.map(get_dirent_names)
		.map(names => names.map(name => `./srv/${name}/bin/run.ts`))
		.chain(check_files_exist)
		.map(get_existing_paths)
		.chain(paths =>
			Oath.all(
				paths.map(path =>
					run_async_command(`opt/bun run ${path}`, { stdout: "pipe", stderr: "pipe" }),
				),
			).map(noop),
		)
		.orElse(console.error)
