// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Thunk, Unary } from "@ordo-pink/tau"
import { map, pipe } from "ramda"
import * as util from "@ordo-pink/binutil"
import { readdir0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"

// --- Public ---

type _F = Thunk<Oath<void, Error>>
export const compileBin: _F = () =>
	readdir0("./boot/src", { withFileTypes: true })
		.tap(startCompileBinsProgress)
		.map(util.direntsToDirs)
		.map(util.getNames)
		.map(dirsToBinIndexPaths)
		.chain(util.checkFilesExist0)
		.map(util.getExistingPaths)
		.chain(runCompileBinCommands0)
		.map(finishCompileBinsProgress)

// --- Internal ---

const _compileBinsProgress = util.createProgress()
const startCompileBinsProgress = () => _compileBinsProgress.start("Compiling binaries")
const incCompileBinsProgress = _compileBinsProgress.inc
const finishCompileBinsProgress = _compileBinsProgress.finish

const _dirToBinIndexPath: Unary<string, string> = dir => `./boot/src/${dir}/index.ts`
const dirsToBinIndexPaths: Unary<string[], string[]> = map(_dirToBinIndexPath)

const _runCompileBinCommand0: Unary<string, Oath<void, Error>> = file =>
	util
		.runBunCommand0(`build ./boot/src/${file}/index.ts --compile --outfile ${file}`)
		.tap(incCompileBinsProgress)
const runCompileBinCommands0: Unary<string[], Oath<void[], Error>> = pipe(
	map(_runCompileBinCommand0),
	Oath.all
)
