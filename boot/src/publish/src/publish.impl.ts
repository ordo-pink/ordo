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
import { Oath } from "@ordo-pink/oath"
import { readdir0 } from "@ordo-pink/fs"

export const publish = () =>
	readdir0("./srv", { withFileTypes: true })
		.map(direntsToDirs)
		.map(getNames)
		.map(namesToCompileScriptPaths)
		.chain(checkFilesExist0)
		.map(getExistingPaths)
		.tap(startProgress)
		.chain(runCompileScripts)
		.map(progress.finish)
		.orNothing()

// --- Internal ---

const progress = createProgress()

const startProgress = () => progress.start("Building and publishing srvs")

const namesToCompileScriptPaths = (names: string[]) =>
	names.map(name => `./srv/${name}/bin/publish.ts`)
const runCompileScript = (path: string) =>
	runBunCommand0(`run ${path}`, { stdout: "pipe", stderr: "pipe" }).bimap(
		progress.break,
		progress.inc,
	)
const runCompileScripts = (paths: string[]) => Oath.all(paths.map(runCompileScript))
