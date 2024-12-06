// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import {
	check_files_exist,
	create_progress,
	dirents_to_dirs,
	get_dirent_names,
	get_existing_paths,
	run_bun_command,
} from "@ordo-pink/binutil"
import { readdir0 } from "@ordo-pink/fs"

export const publish = () =>
	readdir0("./srv", { withFileTypes: true })
		.pipe(ops0.map(dirents_to_dirs))
		.pipe(ops0.map(get_dirent_names))
		.pipe(ops0.map(namesToCompileScriptPaths))
		.pipe(ops0.chain(check_files_exist))
		.pipe(ops0.map(get_existing_paths))
		.pipe(ops0.tap(startProgress))
		.pipe(ops0.chain(runCompileScripts))
		.pipe(ops0.map(progress.finish))
		.invoke(invokers0.or_nothing)

// --- Internal ---

const progress = create_progress()

const startProgress = () => progress.start("Building and publishing srvs")

const namesToCompileScriptPaths = (names: string[]) => names.map(name => `./srv/${name}/bin/publish.ts`)
const runCompileScript = (path: string) =>
	run_bun_command(`run ${path}`, { stdout: "pipe", stderr: "pipe" }).pipe(ops0.bimap(progress.break, progress.inc))
const runCompileScripts = (paths: string[]) => Oath.Merge(paths.map(runCompileScript))
