/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { S3Client, S3File } from "bun"

import { Oath, ops0 } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/core"
import { prop } from "@ordo-pink/tau"

import { type TPersistenceStrategyDataS3 } from "./backend-persistence-strategy-data-bun-s3.types"

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
export const PersistenceStrategyDataS3: TPersistenceStrategyDataS3 = {
	Of: ({ access_key, bucket, endpoint, region, secret_key }) => {
		const s3 = new Bun.S3Client({ accessKeyId: access_key, bucket, endpoint, region, secretAccessKey: secret_key })

		return {
			exists: (uid, fsid) =>
				get_key(uid, fsid)
					.pipe(ops0.chain(check_file_exists(s3)))
					.pipe(ops0.map(prop("exists"))),

			create: (uid, fsid, content) =>
				get_key(uid, fsid)
					.pipe(ops0.chain(validate_file_does_not_exist(s3)))
					.pipe(ops0.map(prop("path")))
					.pipe(ops0.chain(write_file(s3, content))),

			read: (uid, fsid) =>
				get_key(uid, fsid)
					.pipe(ops0.chain(validate_file_exists(s3)))
					.pipe(ops0.map(prop("file")))
					.pipe(ops0.chain(get_file_content)),

			update: (uid, fsid, content) =>
				get_key(uid, fsid)
					.pipe(ops0.chain(get_file(s3)))
					.pipe(ops0.map(prop("path")))
					.pipe(ops0.chain(write_file(s3, content))),

			delete: (uid, fsid) =>
				get_key(uid, fsid)
					.pipe(ops0.chain(validate_file_exists(s3)))
					.pipe(ops0.map(prop("file")))
					.pipe(ops0.chain(delete_file)),

			mtime: (uid, fsid) =>
				get_key(uid, fsid)
					.pipe(ops0.chain(validate_file_exists(s3)))
					.pipe(ops0.map(prop("file")))
					.pipe(ops0.chain(get_file_modification_timestamp)),
		}
	},
}

// --- Internal ---

const already_exists_rrr = () => RRR.codes.eexist("File already exists")
const not_found_rrr = () => RRR.codes.enoent("File not found")
const io_rrr = (e: Error) => RRR.codes.eio(e.message)

const get_file = (s3: S3Client) => (path: string) =>
	Oath.Try(() => s3.file(path))
		.pipe(ops0.map(file => ({ path, file })))
		.pipe(ops0.rejected_map(io_rrr))

const check_file_exists = (s3: S3Client) => (path: string) =>
	Oath.Resolve(get_file(s3))
		.pipe(ops0.chain(f => f(path)))
		.pipe(ops0.map(prop("file")))
		.pipe(
			ops0.chain(file =>
				Oath.FromPromise(() => file.exists())
					.fix(() => false)
					.pipe(ops0.map(exists => ({ file, exists }))),
			),
		)

const validate_file_exists = (s3: S3Client) => (path: string) =>
	Oath.Resolve(check_file_exists(s3))
		.pipe(ops0.chain(f => f(path)))
		.pipe(
			ops0.chain(({ exists, file }) =>
				Oath.If(exists)
					.pipe(ops0.rejected_map(not_found_rrr))
					.pipe(ops0.map(() => ({ path, file }))),
			),
		)

const validate_file_does_not_exist = (s3: S3Client) => (path: string) =>
	Oath.Resolve(check_file_exists(s3))
		.pipe(ops0.chain(f => f(path)))
		.pipe(
			ops0.chain(({ exists, file }) =>
				Oath.If(!exists)
					.pipe(ops0.rejected_map(already_exists_rrr))
					.pipe(ops0.map(() => ({ path, file }))),
			),
		)

const write_file = (s3: S3Client, content: ReadableStream) => (path: string) =>
	Oath.Try(() => new Response(content))
		.pipe(ops0.chain(data => Oath.FromPromise(() => s3.write(path, data))))
		.pipe(ops0.rejected_map(io_rrr))

const delete_file = (file: S3File) => Oath.Try(() => file.delete()).pipe(ops0.rejected_map(io_rrr))

const get_file_modification_timestamp = (file: S3File) =>
	Oath.FromPromise(() => file.stat())
		.pipe(ops0.map(stat => stat.lastModified.getTime()))
		.pipe(ops0.map(milliseconds => milliseconds / 1000))
		.pipe(ops0.map(Math.floor))
		.pipe(ops0.rejected_map(e => RRR.codes.eio(e.message)))

const get_file_content = (file: S3File) => Oath.Try(() => file.readable).pipe(ops0.rejected_map(io_rrr))

const get_key = (uid: Ordo.User.ID, fsid: Ordo.Metadata.FSID) => Oath.Resolve(`${uid}/${fsid}`)
