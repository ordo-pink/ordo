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
		.pipe(ops0.tap(() => progress.start("Building applications for production")))
		.pipe(ops0.chain(run_compile_scripts))
		.pipe(ops0.map(progress.finish))
		.invoke(invokers0.or_else(console.error))

// --- Internal ---

const progress = create_progress()

const names_to_compile_script_paths = (names: string[]) => names.map(name => `./srv/${name}/bin/build.ts`)
const runCompileScript = (path: string) =>
	run_bun_command(`run ${path}`, { stdout: "pipe", stderr: "pipe" }).pipe(ops0.tap(progress.inc))
const run_compile_scripts = (paths: string[]) => Oath.Merge(paths.map(runCompileScript))
