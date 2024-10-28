// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

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

export const compile = () =>
	readdir0("./srv", { withFileTypes: true })
		.pipe(ops0.map(dirents_to_dirs))
		.pipe(ops0.map(get_dirent_names))
		.pipe(ops0.map(names_to_compile_script_paths))
		.pipe(ops0.chain(check_files_exist))
		.pipe(ops0.map(get_existing_paths))
		.pipe(ops0.tap(start_progress))
		.pipe(ops0.chain(run_compile_scripts))
		.pipe(ops0.map(finish_progress))
		.invoke(invokers0.or_else(console.error))

// --- Internal ---

const progress = create_progress()

const start_progress = () => progress.start("Compiling binaries")
const incProgress = () => progress.inc()
const finish_progress = () => progress.finish()

const names_to_compile_script_paths = (names: string[]) =>
	names.map(name => `./srv/${name}/bin/compile.ts`)
const runCompileScript = (path: string) =>
	run_bun_command(`run ${path}`, { stdout: "pipe", stderr: "pipe" }).pipe(ops0.tap(incProgress))
const run_compile_scripts = (paths: string[]) => Oath.Merge(paths.map(runCompileScript))
