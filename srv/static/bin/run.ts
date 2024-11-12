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

import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { die, dirents_to_dirs, get_dirent_names, run_async_command } from "@ordo-pink/binutil"
import { dir_exists0, is_file0, readdir0 } from "@ordo-pink/fs"
import { ConsoleLogger } from "@ordo-pink/logger"
import { getc } from "@ordo-pink/getc"

const { ORDO_STATIC_ROOT } = getc(["ORDO_STATIC_ROOT"])

void Oath.Resolve("./srv")
	.pipe(ops0.chain(path => readdir0(path, { withFileTypes: true })))
	.pipe(ops0.map(dirents_to_dirs))
	.pipe(ops0.map(get_dirent_names))
	.pipe(ops0.map(names => names.map(name => `./srv/${name}/static`)))
	.pipe(
		ops0.chain(paths =>
			Oath.Merge(
				paths.map(path => dir_exists0(path).pipe(ops0.map(exists => (exists ? path : false)))),
			),
		),
	)
	.pipe(ops0.map(items => items.filter(Boolean) as string[]))
	.and(publicPaths =>
		Oath.Merge(
			publicPaths.map(publicPath =>
				readdir0(publicPath, { withFileTypes: true }).pipe(
					ops0.chain(dirents =>
						Oath.Merge(
							dirents.map(dirent => {
								ConsoleLogger.info(
									`STATIC copying file ${publicPath}/${dirent.name} -> ${ORDO_STATIC_ROOT}/${dirent.name}`,
								)

								return is_file0(`${publicPath}/${dirent.name}`).pipe(
									ops0.map(isFile => {
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
	.invoke(invokers0.or_else(die()))

void run_async_command("opt/bun run --watch srv/static/index.ts", {
	stdout: "pipe",
	stderr: "pipe",
	env: { ...process.env, FORCE_COLOR: "1" },
}).invoke(invokers0.or_else(die()))

void Oath.Resolve("./srv")
	.pipe(ops0.chain(path => readdir0(path, { withFileTypes: true })))
	.pipe(ops0.map(dirents_to_dirs))
	.pipe(ops0.map(get_dirent_names))
	.pipe(ops0.map(names => names.map(name => `./srv/${name}/static`)))
	.pipe(
		ops0.chain(paths =>
			Oath.Merge(paths.map(path => dir_exists0(path).and(exists => (exists ? path : false)))),
		),
	)
	.and(items => items.filter(Boolean) as string[])
	.and(public_paths =>
		public_paths.map(publicPath =>
			watch(publicPath, { recursive: true }, (event, filename) => {
				ConsoleLogger.info(
					`STATIC copying file ${publicPath}/${filename} -> ${ORDO_STATIC_ROOT}/${filename}`,
				)

				void Bun.write(`${ORDO_STATIC_ROOT}/${filename}`, Bun.file(`${publicPath}/${filename}`))
			}),
		),
	)
	.invoke(invokers0.or_else(die()))
