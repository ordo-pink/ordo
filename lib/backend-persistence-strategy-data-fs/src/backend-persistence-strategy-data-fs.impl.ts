/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { BunFile } from "bun"
import { resolve } from "path"

import { Oath, ops0 } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/core"
import { prop } from "@ordo-pink/tau"

import { TPersistenceStategyDataFS } from "./backend-persistence-strategy-data-fs.types"

/**
 * `PersistenceStrategyDataFS` implements `OrdoBackend.Data.PersistenceStrategy` for storing data
 * using file system. To create a `PersistenceStrategyDataFS`, you need to provide the root directory
 * where all the content will be stored. This strategy will automatically create the root directory
 * if it does not exist.
 *
 * @warning This strategy is not intended to be used in production.
 *
 * @example
 * const data_ps = PersistenceStrategyDataFS.of("/var/dt/files")
 */
export const PersistenceStrategyDataFS: TPersistenceStategyDataFS = {
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

			mtime: (uid, fsid) =>
				get_path(uid, fsid)
					.pipe(ops0.chain(validate_file_exists))
					.pipe(ops0.map(prop("file")))
					.pipe(ops0.map(file => file.lastModified)),
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
	Oath.Try(() => Bun.readableStreamToArrayBuffer(content))
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

const get_file_content = (file: BunFile) => Oath.Try(() => file.stream()).pipe(ops0.rejected_map(io_rrr))

const get_path_from_root = (root: string) => (uid: Ordo.User.UID, fsid: Ordo.Metadata.FSID) =>
	Oath.Try(() => resolve(root, uid, ...fsid.split("-"))).pipe(ops0.rejected_map(io_rrr))
