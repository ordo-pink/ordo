// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { map, pipe } from "ramda"

import * as util from "@ordo-pink/binutil"
import type { Thunk, Unary } from "@ordo-pink/tau"
import { Oath } from "@ordo-pink/oath"
import { readdir0 } from "@ordo-pink/fs"

// --- Public ---

type _F = Thunk<Oath<void, void>>
export const createSymlinks: _F = () =>
	readdir0("./etc/init", { withFileTypes: true })
		.tap(startSymlinksProgress)
		.map(util.dirents_to_files)
		.map(util.get_dirent_names)
		.chain(runSymlinkCommands0)
		.bimap(breakSymlinksProgress, finishSymlinksProgress)

// --- Internal ---

const _symlinksProgress = util.create_progress()
const startSymlinksProgress = () => _symlinksProgress.start("Creating symbolic links")
const incSymlinksProgress = _symlinksProgress.inc
const finishSymlinksProgress = _symlinksProgress.finish
const breakSymlinksProgress = _symlinksProgress.break

const _runSymlinkCommand0: Unary<string, Oath<void, Error>> = file =>
	util.run_command(`ln -snf ./etc/init/${file} ${file}`).tap(incSymlinksProgress)
const runSymlinkCommands0: Unary<string[], Oath<void[], Error>> = pipe(
	map(_runSymlinkCommand0),
	Oath.all,
)
