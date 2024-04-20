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

import { BigIntStats, Stats, promises } from "fs"
import { cwd } from "process"
import { join } from "path"

import { Oath, oathify } from "@ordo-pink/oath"
import { chain0 } from "@ordo-pink/oath/operators/chain"
import { fromBoolean0 } from "@ordo-pink/oath/constructors/from-falsy"
import { fromPromise0 } from "@ordo-pink/oath/constructors/from-promise"
import { map0 } from "@ordo-pink/oath/operators/map"
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
	fromPromise0<Stats | BigIntStats, Error>(() => promises.stat(...args))
export const readdir0 = oathify(promises.readdir)
export const mkdirRecursive0 = (path: string) => mkdir0(path, { recursive: true })

export const writeFileRecursive0 = (...[path, data, options]: Parameters<typeof writeFile0>) =>
	fromBoolean0(
		typeof path === "string",
		noop,
		() => new Error("writeFileRecursive0 can only create files from string paths"),
	)
		.pipe(chain0(() => createParentIfNotExists0(path as string)))
		.pipe(chain0(() => writeFile0(path, data, options)))

export const createDirectoryIfNotExists0 = (path: string) =>
	stat0(path)
		.fix(() => mkdirRecursive0(path))
		.pipe(map0(noop))

export const createParentIfNotExists0 = (path: string) =>
	Oath.resolve(path).pipe(map0(getParentPath)).pipe(chain0(createDirectoryIfNotExists0))

export const fileExists0 = (path: string) =>
	stat0(path)
		.pipe(map0(stat => stat.isFile()))
		.fix(() => false)

export const directoryExists0 = (path: string) =>
	stat0(path)
		.pipe(map0(stat => stat.isDirectory()))
		.fix(() => false)

export const isFile0 = fileExists0
export const isDirectory0 = directoryExists0
