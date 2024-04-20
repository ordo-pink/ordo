// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import {
	checkFilesExist0,
	direntsToDirs,
	getExistingPaths,
	getNames,
	runAsyncCommand0,
} from "@ordo-pink/binutil"
import { Oath } from "@ordo-pink/oath"
import { noop } from "@ordo-pink/tau"
import { readdir0 } from "@ordo-pink/fs"

export const run = () =>
	readdir0("./srv", { withFileTypes: true })
		.map(direntsToDirs)
		.map(getNames)
		.map(names => names.map(name => `./srv/${name}/bin/run.ts`))
		.chain(checkFilesExist0)
		.map(getExistingPaths)
		.chain(paths =>
			Oath.all(
				paths.map(path =>
					runAsyncCommand0(`opt/bun run ${path}`, { stdout: "pipe", stderr: "pipe" }),
				),
			).map(noop),
		)
		.orElse(console.error)
