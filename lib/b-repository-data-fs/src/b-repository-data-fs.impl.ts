/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { BunFile } from "bun"
import { resolve } from "path"

import { type Core, core } from "@ordo-pink/sdk-core"
import { oath } from "@ordo-pink/oath"

import * as Types from "./b-repository-data-fs.types"

export const create: Types.Create = root => {
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

const already_exists_rrr = () => core.rrr.eexist("File already exists")
const not_found_rrr = () => core.rrr.enoent("File not found")
const io_rrr = (e: unknown) => core.rrr.eio("Failed to store local data", e)

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

const get_path_from_root = (root: string) => (uid: Core.User.Id, fsid: Core.Data.Id) =>
	oath.try(() => resolve(root, uid, ...fsid.split("-"))).pipe(oath.ops.rmap(io_rrr))
