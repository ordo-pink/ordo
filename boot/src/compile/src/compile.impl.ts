// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import {
	checkFilesExist0,
	createProgress,
	direntsToDirs,
	getExistingPaths,
	getNames,
	runBunCommand0,
} from "@ordo-pink/binutil"
import { readdir0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"

export const compile = () =>
	readdir0("./srv", { withFileTypes: true })
		.map(direntsToDirs)
		.map(getNames)
		.map(namesToCompileScriptPaths)
		.chain(checkFilesExist0)
		.map(getExistingPaths)
		.tap(startProgress)
		.chain(runCompileScripts)
		.map(finishProgress)
		.orElse(console.error)

// --- Internal ---

const progress = createProgress()

const startProgress = () => progress.start(`Compiling binaries`)
const incProgress = () => progress.inc()
const finishProgress = () => progress.finish()

const namesToCompileScriptPaths = (names: string[]) =>
	names.map(name => `./srv/${name}/bin/compile.ts`)
const runCompileScript = (path: string) =>
	runBunCommand0(`run ${path}`, { stdout: "pipe", stderr: "pipe" }).tap(incProgress)
const runCompileScripts = (paths: string[]) => Oath.all(paths.map(runCompileScript))
