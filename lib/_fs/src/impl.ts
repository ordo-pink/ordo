/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { BigIntStats, Stats, promises } from "fs"
import { join } from "path"

import { Oath, oath } from "@ordo-pink/oss-oath"

export const get_parent_path = (path: string) => {
	const cleanPath = path.endsWith("/") ? path.slice(0, -1) : path

	return join(cleanPath.split("/").slice(0, -1).join("/"))
}

const oathify =
	<$Function extends (...args: any[]) => any>(f: $Function) =>
	(
		...args: Parameters<$Function>
	): $Function extends (...args: any[]) => infer _ReturnType ? Oath.Instance<Awaited<_ReturnType>, Error> : never =>
		oath.from_promise(() => f(...args)) as any

export const mkdir0 = oathify(promises.mkdir)
export const create_file0 = oathify(promises.writeFile)
export const write_file0 = create_file0
export const read_file0 = oathify(promises.readFile)
export const mv0 = oathify(promises.rename)
export const stat0 = (...args: Parameters<typeof promises.stat>) =>
	oath.from_promise<Stats | BigIntStats, Error>(() => promises.stat(...args))
export const mkdir_rec0 = (path: string) => mkdir0(path, { recursive: true })
export const create_dir_if_not_exists0 = (path: string) =>
	stat0(path)
		.pipe(oath.ops.fix(() => mkdir_rec0(path)))
		.pipe(oath.ops.map(() => void 0))
export const create_parent_if_not_exists0 = (path: string) =>
	oath.of(path).pipe(oath.ops.map(get_parent_path)).pipe(oath.ops.chain(create_dir_if_not_exists0))
export const file_exists0 = (path: string) =>
	stat0(path)
		.pipe(oath.ops.map(stat => stat.isFile()))
		.pipe(oath.ops.fix(() => false))
export const dir_exists0 = (path: string) =>
	stat0(path)
		.pipe(oath.ops.map(stat => stat.isDirectory()))
		.pipe(oath.ops.fix(() => false))
