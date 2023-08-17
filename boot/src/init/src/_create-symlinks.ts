// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Thunk, Unary } from "@ordo-pink/tau"
import { map, pipe } from "ramda"
import * as util from "@ordo-pink/binutil"
import { readdir0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"

// --- Public ---

type _F = Thunk<Oath<void, void>>
export const createSymlinks: _F = () =>
	readdir0("./etc/init", { withFileTypes: true })
		.tap(startSymlinksProgress)
		.map(util.direntsToFiles)
		.map(util.getNames)
		.chain(runSymlinkCommands0)
		.bimap(breakSymlinksProgress, finishSymlinksProgress)

// --- Internal ---

const _symlinksProgress = util.createProgress()
const startSymlinksProgress = () => _symlinksProgress.start("Creating symbolic links")
const incSymlinksProgress = _symlinksProgress.inc
const finishSymlinksProgress = _symlinksProgress.finish
const breakSymlinksProgress = _symlinksProgress.break

const _runSymlinkCommand0: Unary<string, Oath<void, Error>> = file =>
	util.runCommand0(`ln -snf ./etc/init/${file} ${file}`).tap(incSymlinksProgress)
const runSymlinkCommands0: Unary<string[], Oath<void[], Error>> = pipe(
	map(_runSymlinkCommand0),
	Oath.all
)
