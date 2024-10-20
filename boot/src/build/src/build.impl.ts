// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

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

export const compile = () =>
	readdir0("./srv", { withFileTypes: true })
		.map(dirents_to_dirs)
		.map(get_dirent_names)
		.map(namesToCompileScriptPaths)
		.chain(check_files_exist)
		.map(get_existing_paths)
		.tap(startProgress)
		.chain(runCompileScripts)
		.map(finishProgress)
		.orElse(console.error)

// --- Internal ---

const progress = create_progress()

const startProgress = () => progress.start("Compiling binaries")
const incProgress = () => progress.inc()
const finishProgress = () => progress.finish()

const namesToCompileScriptPaths = (names: string[]) =>
	names.map(name => `./srv/${name}/bin/compile.ts`)
const runCompileScript = (path: string) =>
	run_bun_command(`run ${path}`, { stdout: "pipe", stderr: "pipe" }).tap(incProgress)
const runCompileScripts = (paths: string[]) => Oath.all(paths.map(runCompileScript))
