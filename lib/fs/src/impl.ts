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

import { Oath, ops0 } from "@ordo-pink/oath"
import { noop } from "@ordo-pink/tau"

export const get_parent_path = (path: string) => {
	const cleanPath = path.endsWith("/") ? path.slice(0, -1) : path

	return join(cleanPath.split("/").slice(0, -1).join("/"))
}

export const get_absolute_path = (path: string) => {
	return join(cwd(), path)
}

const oathify =
	<T extends (...args: any[]) => any>(f: T) =>
	(
		...args: Parameters<T>
	): T extends (...args: any[]) => infer I ? Oath<Awaited<I>, Error> : never =>
		Oath.FromPromise(() => f(...args)) as any

export const mkdir0 = oathify(promises.mkdir)
export const rmdir0 = oathify(promises.rm)
export const create_file0 = oathify(promises.writeFile)
export const write_file0 = create_file0
export const read_file0 = oathify(promises.readFile)
export const removeFile0 = rmdir0
export const mv0 = oathify(promises.rename)
export const rename0 = mv0
export const stat0 = (...args: Parameters<typeof promises.stat>) =>
	Oath.FromPromise<Stats | BigIntStats, Error>(() => promises.stat(...args))
export const readdir0 = oathify(promises.readdir)
export const mkdir_rec0 = (path: string) => mkdir0(path, { recursive: true })

export const write_file_rec0 = (...[path, data, options]: Parameters<typeof write_file0>) =>
	Oath.If(typeof path === "string", {
		F: () => new Error("writeFileRecursive0 can only create files from string paths"),
	})
		.pipe(ops0.chain(() => create_parent_if_not_exists0(path as string)))
		.pipe(ops0.chain(() => write_file0(path, data, options)))

export const create_dir_if_not_exists0 = (path: string) =>
	stat0(path)
		.fix(() => mkdir_rec0(path))
		.pipe(ops0.map(noop))

export const create_parent_if_not_exists0 = (path: string) =>
	Oath.Resolve(path).pipe(ops0.map(get_parent_path)).pipe(ops0.chain(create_dir_if_not_exists0))

export const file_exists0 = (path: string) =>
	stat0(path)
		.pipe(ops0.map(stat => stat.isFile()))
		.fix(() => false)

export const dir_exists0 = (path: string) =>
	stat0(path)
		.pipe(ops0.map(stat => stat.isDirectory()))
		.fix(() => false)

export const is_file0 = file_exists0
export const is_dir0 = dir_exists0

export const watch_deep = async (dir: string, callback: () => void) => {
	const children = await promises.readdir(dir)

	for (const child of children) {
		if ((await promises.stat(`${dir}/${child}`)).isDirectory())
			void watch_deep(`${dir}/${child}`, callback)
		else watch(dir, callback)
	}
}

export const watch_deep0 = oathify(watch_deep)
