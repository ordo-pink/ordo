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

import { S3Client, S3File } from "bun"

import { type Core, core } from "@ordo-pink/sdk-core"
import { oath } from "@ordo-pink/oss-oath"

import type * as Types from "./b-repository-data-s3.types"

export const create: Types.Create = (accessKeyId, secretAccessKey, region, bucket, endpoint) => {
	const s3 = new Bun.S3Client({ accessKeyId, bucket, endpoint, region, secretAccessKey })

	return {
		create: (uid, fsid, content) =>
			get_key(uid, fsid)
				.pipe(oath.ops.chain(validate_file_does_not_exist(s3)))
				.pipe(oath.ops.map(({ path }) => path))
				.pipe(oath.ops.chain(write_file(s3, content))),

		read: (uid, fsid) =>
			get_key(uid, fsid)
				.pipe(oath.ops.chain(validate_file_exists(s3)))
				.pipe(oath.ops.map(({ file }) => file))
				.pipe(oath.ops.chain(get_file_content)),

		update: (uid, fsid, content) =>
			get_key(uid, fsid)
				.pipe(oath.ops.chain(get_file(s3)))
				.pipe(oath.ops.map(({ path }) => path))
				.pipe(oath.ops.chain(write_file(s3, content))),

		delete: (uid, fsid) =>
			fsid
				? get_key(uid, fsid)
						.pipe(oath.ops.chain(validate_file_exists(s3)))
						.pipe(oath.ops.map(({ file }) => file))
						.pipe(oath.ops.chain(delete_file))
				: core.todo(),
	}
}

// --- Internal ---

const already_exists_rrr = () => core.rrr.eexist("File already exists")
const not_found_rrr = () => core.rrr.enoent("File not found")
const io_rrr = (e: unknown) => core.rrr.eio("Failed to connect to S3", e)

const get_file = (s3: S3Client) => (path: string) =>
	oath
		.try(() => s3.file(path))
		.pipe(oath.ops.map(file => ({ path, file })))
		.pipe(oath.ops.rmap(io_rrr))

const check_file_exists = (s3: S3Client) => (path: string) =>
	oath
		.resolve(get_file(s3))
		.pipe(oath.ops.chain(f => f(path)))
		.pipe(oath.ops.map(({ file }) => file))
		.pipe(
			oath.ops.chain(file =>
				oath
					.from_promise(() => file.exists())
					.pipe(oath.ops.fix(() => false))
					.pipe(oath.ops.map(exists => ({ file, exists }))),
			),
		)

const validate_file_exists = (s3: S3Client) => (path: string) =>
	oath
		.resolve(check_file_exists(s3))
		.pipe(oath.ops.chain(f => f(path)))
		.pipe(oath.ops.chain(({ exists, file }) => oath.if(exists, { on_true: () => ({ path, file }) })))
		.pipe(oath.ops.rmap(not_found_rrr))

const validate_file_does_not_exist = (s3: S3Client) => (path: string) =>
	oath
		.resolve(check_file_exists(s3))
		.pipe(oath.ops.chain(f => f(path)))
		.pipe(oath.ops.chain(({ exists, file }) => oath.if(!exists, { on_true: () => ({ path, file }) })))
		.pipe(oath.ops.rmap(already_exists_rrr))

const write_file = (s3: S3Client, content: ReadableStream) => (path: string) =>
	oath
		.try(() => new Response(content))
		.pipe(oath.ops.chain(data => oath.from_promise(() => s3.write(path, data))))
		.pipe(oath.ops.rmap(io_rrr))

const delete_file = (file: S3File) => oath.from_promise(() => file.delete()).pipe(oath.ops.rmap(io_rrr))

const get_file_content = (file: S3File) => oath.try(() => file.readable).pipe(oath.ops.rmap(io_rrr))

const get_key = (uid: Core.User.Id, fsid: Core.Data.Id) => oath.resolve(`${uid}/${fsid}`)
