// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import {
	check_files_exist,
	create_progress,
	dirents_to_dirs,
	get_existing_paths,
	get_dirent_names,
	run_bun_command,
} from "@ordo-pink/binutil"
import { Oath } from "@ordo-pink/oath"
import { readdir0 } from "@ordo-pink/fs"

export const publish = () =>
	readdir0("./srv", { withFileTypes: true })
		.map(dirents_to_dirs)
		.map(get_dirent_names)
		.map(namesToCompileScriptPaths)
		.chain(check_files_exist)
		.map(get_existing_paths)
		.tap(startProgress)
		.chain(runCompileScripts)
		.map(progress.finish)
		.orNothing()

// --- Internal ---

const progress = create_progress()

const startProgress = () => progress.start("Building and publishing srvs")

const namesToCompileScriptPaths = (names: string[]) =>
	names.map(name => `./srv/${name}/bin/publish.ts`)
const runCompileScript = (path: string) =>
	run_bun_command(`run ${path}`, { stdout: "pipe", stderr: "pipe" }).bimap(
		progress.break,
		progress.inc,
	)
const runCompileScripts = (paths: string[]) => Oath.all(paths.map(runCompileScript))
