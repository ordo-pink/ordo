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

import { BigIntStats, Stats, promises, watch } from "fs"
import { cwd } from "process"
import { join } from "path"

import { Oath, oathify } from "@ordo-pink/oath"
import { chain_oath } from "@ordo-pink/oath/operators/chain"
import { from_boolean_oath } from "@ordo-pink/oath/constructors/from-falsy"
import { from_promise_oath } from "@ordo-pink/oath/constructors/from-promise"
import { map_oath } from "@ordo-pink/oath/operators/map"
import { noop } from "@ordo-pink/tau"

export const getParentPath = (path: string) => {
	const cleanPath = path.endsWith("/") ? path.slice(0, -1) : path

	return join(cleanPath.split("/").slice(0, -1).join("/"))
}

export const getAbsolutePath = (path: string) => {
	return join(cwd(), path)
}

export const mkdir0 = oathify(promises.mkdir)
export const rmdir0 = oathify(promises.rm)
export const createFile0 = oathify(promises.writeFile)
export const writeFile0 = createFile0
export const readFile0 = oathify(promises.readFile)
export const removeFile0 = rmdir0
export const mv0 = oathify(promises.rename)
export const rename0 = mv0
export const stat0 = (...args: Parameters<typeof promises.stat>) =>
	from_promise_oath<Stats | BigIntStats, Error>(() => promises.stat(...args))
export const readdir0 = oathify(promises.readdir)
export const mkdirRecursive0 = (path: string) => mkdir0(path, { recursive: true })

export const writeFileRecursive0 = (...[path, data, options]: Parameters<typeof writeFile0>) =>
	from_boolean_oath(
		typeof path === "string",
		noop,
		() => new Error("writeFileRecursive0 can only create files from string paths"),
	)
		.pipe(chain_oath(() => createParentIfNotExists0(path as string)))
		.pipe(chain_oath(() => writeFile0(path, data, options)))

export const createDirectoryIfNotExists0 = (path: string) =>
	stat0(path)
		.fix(() => mkdirRecursive0(path))
		.pipe(map_oath(noop))

export const createParentIfNotExists0 = (path: string) =>
	Oath.Resolve(path).pipe(map_oath(getParentPath)).pipe(chain_oath(createDirectoryIfNotExists0))

export const fileExists0 = (path: string) =>
	stat0(path)
		.pipe(map_oath(stat => stat.isFile()))
		.fix(() => false)

export const directoryExists0 = (path: string) =>
	stat0(path)
		.pipe(map_oath(stat => stat.isDirectory()))
		.fix(() => false)

export const isFile0 = fileExists0
export const isDirectory0 = directoryExists0

export const watchDeep = async (dir: string, callback: () => void) => {
	const children = await promises.readdir(dir)

	for (const child of children) {
		if ((await promises.stat(`${dir}/${child}`)).isDirectory())
			void watchDeep(`${dir}/${child}`, callback)
		else watch(dir, callback)
	}
}

export const watchDeep0 = oathify(watchDeep)
