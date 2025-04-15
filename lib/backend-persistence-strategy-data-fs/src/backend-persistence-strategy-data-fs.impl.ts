/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { BunFile } from "bun"
import { resolve } from "path"

import { oath } from "@ordo-pink/oath"
import { prop } from "@ordo-pink/tau"
import { rrr } from "@ordo-pink/core"

import { PersistenceStrategyDataFS } from "./backend-persistence-strategy-data-fs.types"

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
export const create_persistence_strategy_data_fs: PersistenceStrategyDataFS.Create = ({ root }) => {
	const get_path = get_path_from_root(root)

	return {
		exists: (uid, fsid) =>
			get_path(uid, fsid)
				.pipe(oath.ops.chain(check_file_exists))
				.pipe(oath.ops.map(prop("exists"))),

		create: (uid, fsid, content) =>
			get_path(uid, fsid)
				.pipe(oath.ops.chain(validate_file_does_not_exist))
				.pipe(oath.ops.map(prop("path")))
				.pipe(oath.ops.chain(write_file(content))),

		read: (uid, fsid) =>
			get_path(uid, fsid)
				.pipe(oath.ops.chain(validate_file_exists))
				.pipe(oath.ops.map(prop("file")))
				.pipe(oath.ops.chain(get_file_content)),

		update: (uid, fsid, content) =>
			get_path(uid, fsid)
				.pipe(oath.ops.chain(get_file))
				.pipe(oath.ops.chain(write_file(content))),

		delete: (uid, fsid) =>
			get_path(uid, fsid)
				.pipe(oath.ops.chain(validate_file_exists))
				.pipe(oath.ops.map(prop("file")))
				.pipe(oath.ops.chain(delete_file)),

		mtime: (uid, fsid) =>
			get_path(uid, fsid)
				.pipe(oath.ops.chain(validate_file_exists))
				.pipe(oath.ops.map(prop("file")))
				.pipe(oath.ops.map(file => file.lastModified)),
	}
}

// --- Internal ---

const already_exists_rrr = () => rrr.codes.eexist("File already exists")
const not_found_rrr = () => rrr.codes.enoent("File not found")
const io_rrr = (e: unknown) => rrr.codes.eio("Failed to store local data", e)

const get_file = (path: string) => oath.try(() => Bun.file(path)).pipe(oath.ops.rmap(io_rrr))

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
		.pipe(oath.ops.rmap(io_rrr))

const delete_file = (file: BunFile) => oath.from_promise(() => file.delete()).pipe(oath.ops.rmap(io_rrr))

const validate_file_exists = (path: string) =>
	check_file_exists(path).pipe(
		oath.ops.chain(({ exists, file }) =>
			oath
				.if(exists)
				.pipe(oath.ops.rmap(not_found_rrr))
				.pipe(oath.ops.map(() => ({ path, file }))),
		),
	)

const validate_file_does_not_exist = (path: string) =>
	check_file_exists(path).pipe(
		oath.ops.chain(({ exists, file }) =>
			oath
				.if(!exists)
				.pipe(oath.ops.rmap(already_exists_rrr))
				.pipe(oath.ops.map(() => ({ path, file }))),
		),
	)

const get_file_content = (file: BunFile) => oath.try(() => file.stream()).pipe(oath.ops.rmap(io_rrr))

const get_path_from_root = (root: string) => (uid: Ordo.User.UID, fsid: Ordo.Metadata.FSID) =>
	oath.try(() => resolve(root, uid, ...fsid.split("-"))).pipe(oath.ops.rmap(io_rrr))
