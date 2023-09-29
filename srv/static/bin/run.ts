// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { direntsToDirs, getNames, runAsyncCommand0 } from "@ordo-pink/binutil"
import { directoryExists0, readdir0 } from "@ordo-pink/fs"
import { getc } from "@ordo-pink/getc"
import { ConsoleLogger } from "@ordo-pink/logger"
import { Oath } from "@ordo-pink/oath"
import { watch, cp } from "fs"

const { STATIC_ROOT } = getc(["STATIC_ROOT"])
Oath.of("./srv")
	.chain(path => readdir0(path, { withFileTypes: true }))
	.map(direntsToDirs)
	.map(getNames)
	.map(names => names.map(name => `./srv/${name}/static`))
	.chain(paths =>
		Oath.all(paths.map(path => directoryExists0(path).map(exists => (exists ? path : false)))),
	)
	.map(items => items.filter(Boolean) as string[])
	.chain(publicPaths =>
		Oath.all(
			publicPaths.map(publicPath =>
				readdir0(publicPath, { withFileTypes: true }).map(dirents =>
					dirents.map(dirent => {
						ConsoleLogger.info(
							`STATIC copying file ${publicPath}/${dirent.name} -> ${STATIC_ROOT}/${dirent.name}`,
						)

						Bun.write(`${STATIC_ROOT}/${dirent.name}`, Bun.file(`${publicPath}/${dirent.name}`))
					}),
				),
			),
		),
	)
	.orElse(console.log)

runAsyncCommand0("bun run --watch srv/static/index.ts", {
	stdout: "pipe",
	stderr: "pipe",
}).orElse(console.error)

Oath.of("./srv")
	.chain(path => readdir0(path, { withFileTypes: true }))
	.map(direntsToDirs)
	.map(getNames)
	.map(names => names.map(name => `./srv/${name}/static`))
	.chain(paths =>
		Oath.all(paths.map(path => directoryExists0(path).map(exists => (exists ? path : false)))),
	)
	.map(items => items.filter(Boolean) as string[])
	.map(publicPaths =>
		publicPaths.map(publicPath =>
			watch(publicPath, { recursive: true }, (event, filename) => {
				ConsoleLogger.info(
					`STATIC copying file ${publicPath}/${filename} -> ${STATIC_ROOT}/${filename}`,
				)

				Bun.write(`${STATIC_ROOT}/${filename}`, Bun.file(`${publicPath}/${filename}`))
			}),
		),
	)
	.orElse(console.error)
