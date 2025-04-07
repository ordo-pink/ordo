/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { S3Client, S3File } from "bun"

import { oath } from "@ordo-pink/oath"
import { prop } from "@ordo-pink/tau"
import { rrr } from "@ordo-pink/core"

import { PersistenceStrategyDataBunS3 } from "./backend-persistence-strategy-data-bun-s3.types"

/**
 * `PersistenceStrategyDataS3` implements `OrdoBackend.Data.PersistenceStrategy` for storing
 * data using AWS S3.
 *
 * @example
 * const data_ps = PersistenceStrategyDataS3.Of({
 *   access_key: "YOUR_ACCESS_KEY",
 *   bucket: "content-test-bucket"
 *   endpoint: "YOUR_AWS_ENDPOINT",
 *   region: "us-east-1",
 *   secret_key: "YOUR_SECRET_KEY",
 * })
 */
export const create_persistence_strategy_data_bun_s3: PersistenceStrategyDataBunS3.Create = ({
	access_key,
	bucket,
	endpoint,
	region,
	secret_key,
}) => {
	const s3 = new Bun.S3Client({ accessKeyId: access_key, bucket, endpoint, region, secretAccessKey: secret_key })

	return {
		exists: (uid, fsid) =>
			get_key(uid, fsid)
				.pipe(oath.ops.chain(check_file_exists(s3)))
				.pipe(oath.ops.map(prop("exists"))),

		create: (uid, fsid, content) =>
			get_key(uid, fsid)
				.pipe(oath.ops.chain(validate_file_does_not_exist(s3)))
				.pipe(oath.ops.map(prop("path")))
				.pipe(oath.ops.chain(write_file(s3, content))),

		read: (uid, fsid) =>
			get_key(uid, fsid)
				.pipe(oath.ops.chain(validate_file_exists(s3)))
				.pipe(oath.ops.map(prop("file")))
				.pipe(oath.ops.chain(get_file_content)),

		update: (uid, fsid, content) =>
			get_key(uid, fsid)
				.pipe(oath.ops.chain(get_file(s3)))
				.pipe(oath.ops.map(prop("path")))
				.pipe(oath.ops.chain(write_file(s3, content))),

		delete: (uid, fsid) =>
			get_key(uid, fsid)
				.pipe(oath.ops.chain(validate_file_exists(s3)))
				.pipe(oath.ops.map(prop("file")))
				.pipe(oath.ops.chain(delete_file)),

		mtime: (uid, fsid) =>
			get_key(uid, fsid)
				.pipe(oath.ops.chain(validate_file_exists(s3)))
				.pipe(oath.ops.map(prop("file")))
				.pipe(oath.ops.chain(get_file_modification_timestamp)),
	}
}

// --- Internal ---

const already_exists_rrr = () => rrr.codes.eexist("File already exists")
const not_found_rrr = () => rrr.codes.enoent("File not found")
const io_rrr = (e: unknown) => rrr.codes.eio("Failed to connect to S3", e)

const get_file = (s3: S3Client) => (path: string) =>
	oath
		.try(() => s3.file(path))
		.pipe(oath.ops.map(file => ({ path, file })))
		.pipe(oath.ops.rejected_map(io_rrr))

const check_file_exists = (s3: S3Client) => (path: string) =>
	oath
		.resolve(get_file(s3))
		.pipe(oath.ops.chain(f => f(path)))
		.pipe(oath.ops.map(prop("file")))
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
		.pipe(oath.ops.chain(({ exists, file }) => oath.if(exists).pipe(oath.ops.bimap(() => ({ path, file }), not_found_rrr))))

const validate_file_does_not_exist = (s3: S3Client) => (path: string) =>
	oath
		.resolve(check_file_exists(s3))
		.pipe(oath.ops.chain(f => f(path)))
		.pipe(
			oath.ops.chain(({ exists, file }) =>
				oath
					.if(!exists, { on_false: already_exists_rrr, on_true: () => ({ path, file }) })
					.pipe(oath.ops.rejected_map(already_exists_rrr)),
			),
		)

const write_file = (s3: S3Client, content: ReadableStream) => (path: string) =>
	oath
		.try(() => new Response(content))
		.pipe(oath.ops.chain(data => oath.from_promise(() => s3.write(path, data))))
		.pipe(oath.ops.rejected_map(io_rrr))

const delete_file = (file: S3File) => oath.from_promise(() => file.delete()).pipe(oath.ops.rejected_map(io_rrr))

const get_file_modification_timestamp = (file: S3File) =>
	oath
		.from_promise(() => file.stat())
		.pipe(oath.ops.map(stat => stat.lastModified.getTime()))
		.pipe(oath.ops.map(milliseconds => milliseconds / 1000))
		.pipe(oath.ops.bimap(Math.floor, io_rrr))

const get_file_content = (file: S3File) => oath.try(() => file.readable).pipe(oath.ops.rejected_map(io_rrr))

const get_key = (uid: Ordo.User.UID, fsid: Ordo.Metadata.FSID) => oath.resolve(`${uid}/${fsid}`)
