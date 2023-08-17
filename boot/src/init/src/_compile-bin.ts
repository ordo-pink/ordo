// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Thunk, Unary } from "@ordo-pink/tau"
import { map, pipe } from "ramda"
import * as util from "@ordo-pink/binutil"
import { readdir0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"

// --- Public ---

type _F = Thunk<Oath<void, void>>
export const compileBin: _F = () =>
	readdir0("./boot/src", { withFileTypes: true })
		.tap(startCompileBinsProgress)
		.map(util.direntsToDirs)
		.map(util.getNames)
		.chain(checkBinIndexFilesExist0)
		.chain(runCompileBinCommands0)
		.bimap(breakCompileBinsProgress, finishCompileBinsProgress)

// --- Internal ---

const _compileBinsProgress = util.createProgress()
const startCompileBinsProgress = () => _compileBinsProgress.start("Compiling binaries")
const incCompileBinsProgress = _compileBinsProgress.inc
const finishCompileBinsProgress = _compileBinsProgress.finish
const breakCompileBinsProgress = _compileBinsProgress.break

const _binIndexPathToName: Unary<string, string> = path => path.slice(9, -9)
const binIndexPathsToNames: Unary<string[], string[]> = map(_binIndexPathToName)

const _nameToBinIndexPath: Unary<string, string> = name => `boot/src/${name}/index.ts`
const namesToBinIndexPaths: Unary<string[], string[]> = map(_nameToBinIndexPath)

const checkBinIndexFilesExist0: Unary<string[], Oath<string[]>> = names =>
	Oath.of(namesToBinIndexPaths(names))
		.chain(util.checkFilesExist0)
		.map(util.getExistingPaths)
		.map(binIndexPathsToNames)

const _runCompileBinCommand0: Unary<string, Oath<void, Error>> = file =>
	util
		.runBunCommand0(`build boot/src/${file}/index.ts --compile --outfile ${file}`)
		.chain(() => util.runCommand0(`mv -f ${file} bin/${file}`))
		.tap(incCompileBinsProgress)
const runCompileBinCommands0: Unary<string[], Oath<void[], Error>> = pipe(
	map(_runCompileBinCommand0),
	Oath.all
)
