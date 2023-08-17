// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Thunk, Unary } from "@ordo-pink/tau"
import { map, pipe } from "ramda"
import * as util from "@ordo-pink/binutil"
import { readdir0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"

// --- Public ---

type _F = Thunk<Oath<void, void>>
export const initSrv: _F = () =>
	readdir0("./srv", { withFileTypes: true })
		.tap(startInitSrvProgress)
		.map(util.direntsToDirs)
		.map(util.getNames)
		.map(dirsToInitFilePaths)
		.chain(util.checkFilesExist0)
		.map(util.getExistingPaths)
		.chain(runInitCommands0)
		.bimap(breakInitSrvProgress, finishInitSrvProgress)

// --- Internal ---

const _intSrvProgress = util.createProgress()
const startInitSrvProgress = () => _intSrvProgress.start("Initializing server applications")
const incInitSrvProgress = _intSrvProgress.inc
const finishInitSrvProgress = _intSrvProgress.finish
const breakInitSrvProgress = _intSrvProgress.break

const _dirToInitFilePath: Unary<string, string> = dir => `./srv/${dir}/bin/init1.ts` // TODO: replace with init.ts
const dirsToInitFilePaths: Unary<string[], string[]> = map(_dirToInitFilePath)

const _runInitCommand0: Unary<string, Oath<void, Error>> = path =>
	util.runBunCommand0(`run ${path}`).tap(incInitSrvProgress)
const runInitCommands0: Unary<string[], Oath<void[], Error>> = pipe(map(_runInitCommand0), Oath.all)
