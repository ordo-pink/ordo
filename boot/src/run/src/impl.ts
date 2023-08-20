// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import {
	checkFilesExist0,
	direntsToDirs,
	getExistingPaths,
	getNames,
	runBunCommand0,
} from "@ordo-pink/binutil"
import { readdir0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"
import { noop } from "@ordo-pink/tau"

export const run = () =>
	readdir0("./srv", { withFileTypes: true })
		.map(direntsToDirs)
		.map(getNames)
		.map(names => names.map(name => `./srv/${name}/bin/run.ts`)) // TODO: Replace with run.ts
		.chain(checkFilesExist0)
		.map(getExistingPaths)
		.chain(paths =>
			Oath.all(
				paths.map(path => runBunCommand0(`run ${path}`, { stderr: "inherit", stdout: "inherit" }))
			).map(noop)
		)
		.orElse(console.error)
