// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { map, pipe } from "ramda"

import * as util from "@ordo-pink/binutil"
import { Oath, ops0 } from "@ordo-pink/oath"
import type { Thunk, Unary } from "@ordo-pink/tau"
import { readdir0 } from "@ordo-pink/fs"

// --- Public ---

type _F = Thunk<Oath<void, void>>
export const compile_bin: _F = () =>
	readdir0("./boot/src", { withFileTypes: true })
		.pipe(ops0.tap(() => progress.start("Compiling binaries")))
		.and(util.dirents_to_dirs)
		.and(util.get_dirent_names)
		.and(check_bin_index_files_exist)
		.and(run_compile_bin_commands)
		.pipe(ops0.bimap(progress.break, progress.finish))

// --- Internal ---

const progress = util.create_progress()

const bin_index_path_to_name: Unary<string, string> = path => path.slice(9, -9)
const binIndexPathsToNames: Unary<string[], string[]> = map(bin_index_path_to_name)

const name_to_bin_index_path: Unary<string, string> = name => `boot/src/${name}/index.ts`
const namesToBinIndexPaths: Unary<string[], string[]> = map(name_to_bin_index_path)

const check_bin_index_files_exist: Unary<string[], Oath<string[]>> = names =>
	Oath.Resolve(namesToBinIndexPaths(names))
		.and(util.check_files_exist)
		.and(util.get_existing_paths)
		.and(binIndexPathsToNames)

const run_compile_bin_command: Unary<string, Oath<void, Error>> = file =>
	util
		.run_bun_command(`build boot/src/${file}/index.ts --compile --outfile ${file}`)
		.and(() => util.run_command(`mv -f ${file} bin/${file}`))
		.pipe(ops0.tap(progress.inc))

const run_compile_bin_commands: Unary<string[], Oath<void[], Error>> = pipe(
	map(run_compile_bin_command),
	Oath.Merge,
)
