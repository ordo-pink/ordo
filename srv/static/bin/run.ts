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
import { dir_exists0, is_file0, readdir0 } from "@ordo-pink/fs"
import { ConsoleLogger } from "@ordo-pink/logger"
import { Oath } from "@ordo-pink/oath"
import { getc } from "@ordo-pink/getc"

const { ORDO_STATIC_ROOT } = getc(["ORDO_STATIC_ROOT"])

void Oath.Resolve("./srv")
	.pipe(Oath.ops.chain(path => readdir0(path, { withFileTypes: true })))
	.pipe(Oath.ops.map(direntsToDirs))
	.pipe(Oath.ops.map(getNames))
	.pipe(Oath.ops.map(names => names.map(name => `./srv/${name}/static`)))
	.pipe(
		Oath.ops.chain(paths =>
			Oath.Merge(
				paths.map(path => dir_exists0(path).pipe(Oath.ops.map(exists => (exists ? path : false)))),
			),
		),
	)
	.pipe(Oath.ops.map(items => items.filter(Boolean) as string[]))
	.and(publicPaths =>
		Oath.Merge(
			publicPaths.map(publicPath =>
				readdir0(publicPath, { withFileTypes: true }).pipe(
					Oath.ops.chain(dirents =>
						Oath.Merge(
							dirents.map(dirent => {
								ConsoleLogger.info(
									`STATIC copying file ${publicPath}/${dirent.name} -> ${ORDO_STATIC_ROOT}/${dirent.name}`,
								)

								return is_file0(`${publicPath}/${dirent.name}`).pipe(
									Oath.ops.map(isFile => {
										isFile &&
											void Bun.write(
												`${ORDO_STATIC_ROOT}/${dirent.name}`,
												Bun.file(`${publicPath}/${dirent.name}`),
											)

										// TODO: Copy directories
									}),
								)
							}),
						),
					),
				),
			),
		),
	)
	.invoke(Oath.invokers.or_else(die()))

void runAsyncCommand0("opt/bun run --watch srv/static/index.ts", {
	stdout: "pipe",
	stderr: "pipe",
	env: { ...process.env, FORCE_COLOR: "1" },
}).invoke(Oath.invokers.or_else(die()))

void Oath.Resolve("./srv")
	.pipe(Oath.ops.chain(path => readdir0(path, { withFileTypes: true })))
	.pipe(Oath.ops.map(direntsToDirs))
	.pipe(Oath.ops.map(getNames))
	.pipe(Oath.ops.map(names => names.map(name => `./srv/${name}/static`)))
	.pipe(
		Oath.ops.chain(paths =>
			Oath.Merge(paths.map(path => dir_exists0(path).and(exists => (exists ? path : false)))),
		),
	)
	.and(items => items.filter(Boolean) as string[])
	.and(publicPaths =>
		publicPaths.map(publicPath =>
			watch(publicPath, { recursive: true }, (event, filename) => {
				ConsoleLogger.info(
					`STATIC copying file ${publicPath}/${filename} -> ${ORDO_STATIC_ROOT}/${filename}`,
				)

				void Bun.write(`${ORDO_STATIC_ROOT}/${filename}`, Bun.file(`${publicPath}/${filename}`))
			}),
		),
	)
	.invoke(Oath.invokers.or_else(die()))
