import { map, pipe } from "ramda"

import * as util from "@ordo-pink/binutil"
import { Oath, ops0 } from "@ordo-pink/oath"
import type { Thunk, Unary } from "@ordo-pink/tau"
import { readdir0 } from "@ordo-pink/fs"

// --- Public ---

type _F = Thunk<Oath<void, void>>
export const init_srv: _F = () =>
	readdir0("./srv", { withFileTypes: true })
		.pipe(ops0.tap(() => progress.start("Initializing server applications")))
		.and(util.dirents_to_dirs)
		.and(util.get_dirent_names)
		.and(dirs_to_init_file_paths)
		.and(util.check_files_exist)
		.and(util.get_existing_paths)
		.and(run_init_commands)
		.pipe(ops0.bimap(progress.break, progress.finish))

// --- Internal ---

const progress = util.create_progress()

const dir_to_init_file_path: Unary<string, string> = dir => `./srv/${dir}/bin/init.ts`
const dirs_to_init_file_paths: Unary<string[], string[]> = map(dir_to_init_file_path)

const run_init_command: Unary<string, Oath<void, Error>> = path =>
	util.run_bun_command(`run ${path}`).pipe(ops0.tap(progress.inc))
const run_init_commands: Unary<string[], Oath<void[], Error>> = pipe(map(run_init_command), Oath.Merge)
