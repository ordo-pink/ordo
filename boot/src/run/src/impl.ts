// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { getDenoPath, runDenoCommand } from "#lib/binutil/mod.ts"
import { readdir, isFile } from "#lib/fs/mod.ts"
import { Oath } from "#lib/oath/mod.ts"

export const run = () =>
	readdir("./srv")
		.map(entries => entries.filter(entry => entry.isDirectory))
		.map(entries =>
			entries.map(entry =>
				isFile(`./srv/${entry.name}/bin/run.ts`).map(x =>
					x ? `./srv/${entry.name}/bin/run.ts` : null
				)
			)
		)
		.chain(entries => Oath.all(entries))
		.map(entries => entries.filter(Boolean) as string[])
		.chain(entries =>
			Oath.all(
				entries.map(path =>
					runDenoCommand(getDenoPath(), [
						"run",
						"--allow-read",
						"--allow-write",
						"--allow-run",
						"--allow-env",
						path,
					])
				)
			)
		)
