// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { watch } from "fs"

import { die, direntsToDirs, getNames, runAsyncCommand0 } from "@ordo-pink/binutil"
import { directoryExists0, readdir0 } from "@ordo-pink/fs"
import { ConsoleLogger } from "@ordo-pink/logger"
import { Oath } from "@ordo-pink/oath"
import { getc } from "@ordo-pink/getc"

const { ORDO_STATIC_ROOT } = getc(["ORDO_STATIC_ROOT"])

void Oath.of("./srv")
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
							`STATIC copying file ${publicPath}/${dirent.name} -> ${ORDO_STATIC_ROOT}/${dirent.name}`,
						)

						void Bun.write(
							`${ORDO_STATIC_ROOT}/${dirent.name}`,
							Bun.file(`${publicPath}/${dirent.name}`),
						)
					}),
				),
			),
		),
	)
	.orElse(die())

void runAsyncCommand0("opt/bun run --watch srv/static/index.ts", {
	stdout: "pipe",
	stderr: "pipe",
	env: { ...process.env, FORCE_COLOR: "1" },
}).orElse(die())

void Oath.of("./srv")
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
					`STATIC copying file ${publicPath}/${filename} -> ${ORDO_STATIC_ROOT}/${filename}`,
				)

				void Bun.write(`${ORDO_STATIC_ROOT}/${filename}`, Bun.file(`${publicPath}/${filename}`))
			}),
		),
	)
	.orElse(die())
