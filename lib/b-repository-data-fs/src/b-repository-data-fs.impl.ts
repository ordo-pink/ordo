/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
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

import { BunFile } from "bun"
import { resolve } from "path"

import { CORE, type Core, core } from "@ordo-pink/sdk-core"
import { oath } from "@ordo-pink/oss-oath"

import type * as Lib from "./b-repository-data-fs.types"

export const create: Lib.Create = root => {
	const get_path = get_path_from_root(root)

	return {
		create: (uid, fsid, content) =>
			get_path(uid, fsid)
				.pipe(oath.ops.chain(validate_file_does_not_exist))
				.pipe(oath.ops.map(({ path }) => path))
				.pipe(oath.ops.chain(write_file(content))),

		read: (uid, fsid) =>
			get_path(uid, fsid)
				.pipe(oath.ops.chain(validate_file_exists))
				.pipe(oath.ops.map(({ file }) => file))
				.pipe(oath.ops.chain(get_file_content)),

		update: (uid, fsid, content) =>
			get_path(uid, fsid)
				.pipe(oath.ops.chain(get_file))
				.pipe(oath.ops.chain(write_file(content))),

		delete: (uid, fsid) =>
			fsid
				? get_path(uid, fsid)
						.pipe(oath.ops.chain(validate_file_exists))
						.pipe(oath.ops.map(({ file }) => file))
						.pipe(oath.ops.chain(delete_file))
				: core.todo(),
	}
}

// --- Internal ---

const get_file = (path: string) =>
	oath.try(() => Bun.file(path)).pipe(oath.ops.rmap(core.rrr.eio(CORE.RRR.REASON.FILE_READ_FAILED)))

const check_file_exists = (path: string) =>
	get_file(path).pipe(
		oath.ops.chain(file =>
			oath
				.from_promise(() => file.exists())
				.pipe(oath.ops.fix(() => false))
				.pipe(oath.ops.map(exists => ({ file, exists }))),
		),
	)

const write_file = (content: ReadableStream) => (path: BunFile | string) =>
	oath
		.from_promise(() => Bun.readableStreamToArrayBuffer(content) as Promise<ArrayBuffer>)
		.pipe(oath.ops.chain(input => oath.from_promise(() => Bun.write(path, input))))
		.pipe(oath.ops.rmap(core.rrr.eio(CORE.RRR.REASON.FILE_WRITE_FAILED)))

const delete_file = (file: BunFile) =>
	oath.from_promise(() => file.delete()).pipe(oath.ops.rmap(core.rrr.eio(CORE.RRR.REASON.FILE_UNLINK_FAILED)))

const validate_file_exists = (path: string) =>
	check_file_exists(path)
		.pipe(oath.ops.chain(({ exists, file }) => oath.if(exists, { t: () => ({ path, file }) })))
		.pipe(oath.ops.rmap(core.rrr.enoent(CORE.RRR.REASON.NO)))

const validate_file_does_not_exist = (path: string) =>
	check_file_exists(path)
		.pipe(oath.ops.chain(({ exists, file }) => oath.if(!exists, { t: () => ({ path, file }) })))
		.pipe(oath.ops.rmap(core.rrr.eexist(CORE.RRR.REASON.NO)))

const get_file_content = (file: BunFile) =>
	oath.try(() => file.stream()).pipe(oath.ops.rmap(core.rrr.eio(CORE.RRR.REASON.FILE_READ_FAILED)))

const get_path_from_root = (root: string) => (uid: Core.User.Id, fsid: Core.Data.Id) =>
	oath.try(() => resolve(root, uid, ...fsid)).pipe(oath.ops.rmap(core.rrr.eio(CORE.RRR.REASON.INVALID_SERVICE_INITIALIZATION)))
