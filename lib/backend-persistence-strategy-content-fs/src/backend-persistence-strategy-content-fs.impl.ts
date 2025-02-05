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

import { BunFile } from "bun"
import { resolve } from "path"

import { Oath, ops0 } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/core"
import { prop } from "@ordo-pink/tau"

import { TPersistenceStategyContentFS } from "./backend-persistence-strategy-content-fs.types"

/**
 * `ContentPersistenceStrategyFS` implements `ContentPersistenceStrategy` for storing content using
 * file system. To create a `ContentPersistenceStrategyFS`, you need to provide the root directory
 * where all the content will be stored. This strategy will automatically create the root directory
 * if it does not exist.
 *
 * @warning This strategy is not intended to be used in production.
 *
 * @example
 * const contentPersistenceStrategy = ContentPersistenceStrategyFS.of("/var/dt/files")
 */
export const PersistenceStrategyContentFS: TPersistenceStategyContentFS = {
	Of: root => {
		const get_path = get_path_from_root(root)

		return {
			exists: (uid, fsid) =>
				get_path(uid, fsid)
					.pipe(ops0.chain(check_file_exists))
					.pipe(ops0.map(prop("exists"))),

			create: (uid, fsid, content) =>
				get_path(uid, fsid)
					.pipe(ops0.chain(validate_file_does_not_exist))
					.pipe(ops0.map(prop("path")))
					.pipe(ops0.chain(write_file(content))),

			read: (uid, fsid) =>
				get_path(uid, fsid)
					.pipe(ops0.chain(validate_file_exists))
					.pipe(ops0.map(prop("file")))
					.pipe(ops0.chain(get_file_content)),

			update: (uid, fsid, content) =>
				get_path(uid, fsid)
					.pipe(ops0.chain(get_file))
					.pipe(ops0.chain(write_file(content))),

			delete: (uid, fsid) =>
				get_path(uid, fsid)
					.pipe(ops0.chain(validate_file_exists))
					.pipe(ops0.map(prop("file")))
					.pipe(ops0.chain(delete_file)),
		}
	},
}

// --- Internal ---

const already_exists_rrr = () => RRR.codes.eexist("File already exists")
const not_found_rrr = () => RRR.codes.enoent("File not found")
const io_rrr = (e: Error) => RRR.codes.eio(e.message)

const get_file = (path: string) => Oath.Try(() => Bun.file(path)).pipe(ops0.rejected_map(io_rrr))

const check_file_exists = (path: string) =>
	get_file(path).pipe(
		ops0.chain(file =>
			Oath.FromPromise(() => file.exists())
				.fix(() => false)
				.pipe(ops0.map(exists => ({ file, exists }))),
		),
	)

const write_file = (content: ReadableStream) => (path: BunFile | string) =>
	Oath.Try(() => new Response(content))
		.pipe(ops0.chain(input => Oath.FromPromise(() => Bun.write(path as BunFile, input))))
		.pipe(ops0.rejected_map(io_rrr))

const delete_file = (file: BunFile) => Oath.Try(() => file.delete()).pipe(ops0.rejected_map(io_rrr))

const validate_file_exists = (path: string) =>
	check_file_exists(path).pipe(
		ops0.chain(({ exists, file }) =>
			Oath.If(exists)
				.pipe(ops0.rejected_map(not_found_rrr))
				.pipe(ops0.map(() => ({ path, file }))),
		),
	)

const validate_file_does_not_exist = (path: string) =>
	check_file_exists(path).pipe(
		ops0.chain(({ exists, file }) =>
			Oath.If(!exists)
				.pipe(ops0.rejected_map(already_exists_rrr))
				.pipe(ops0.map(() => ({ path, file }))),
		),
	)

const get_file_content = (file: BunFile) => Oath.Try(() => file.readable).pipe(ops0.rejected_map(io_rrr))

const get_path_from_root = (root: string) => (uid: Ordo.User.ID, fsid: Ordo.Metadata.FSID) =>
	Oath.Try(() => resolve(root, uid, ...fsid.split("-"))).pipe(ops0.rejected_map(io_rrr))
