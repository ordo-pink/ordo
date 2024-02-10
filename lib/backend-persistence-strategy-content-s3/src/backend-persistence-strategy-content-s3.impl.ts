// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { DeleteObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { PassThrough, Readable } from "stream"
import { Upload } from "@aws-sdk/lib-storage"

import { ContentPersistenceStrategy, Data, FSID, UserID } from "@ordo-pink/data"
import { Oath } from "@ordo-pink/oath"

import { S3DownloadStream } from "./s3-download-stream"

type Params = {
	accessKeyId: string
	secretAccessKey: string
	region: string
	bucketName: string
	endpoint?: string
}

/**
 * `ContentPersistenceStrategyS3` implements `ContentPersistenceStrategy` for storing content using
 * AWS S3. To create a `ContentPersistenceStrategyS3`.
 *
 * @example
 * const contentPersistenceStrategy = ContentPersistenceStrategyFS.of({
 *   accessKeyId: "YOUR_ACCESS_KEY",
 *   secretAccessKey: "YOUR_SECRET_KEY",
 *   region: "us-east-1",
 *   endpoint: "YOUR_AWS_ENDPOINT",
 *   bucketName: "content-test-bucket"
 * })
 */
export const ContentPersistenceStrategyS3 = {
	/**
	 * `ContentPersistenceStrategyS3` factory.
	 */
	of: ({
		accessKeyId,
		secretAccessKey,
		region,
		endpoint,
		bucketName,
	}: Params): ContentPersistenceStrategy<Readable> => {
		const s3 = new S3Client({ region, endpoint, credentials: { accessKeyId, secretAccessKey } })
		const Bucket = bucketName

		return {
			create: () => Oath.of("OK"),

			delete: (uid, fsid) =>
				Oath.of(getKey(uid, fsid))
					.chain(Key => Oath.from(() => s3.send(new DeleteObjectCommand({ Bucket, Key }))))
					.bimap(
						() => Data.Errors.DataNotFound,
						() => "OK",
					),

			read: (uid, fsid) =>
				Oath.of(getKey(uid, fsid))
					.map(Key => new S3DownloadStream({ Key, Bucket, s3 }))
					.fix(() => Readable.from([""])),

			write: (uid, fsid, content, length) =>
				Oath.of(getKey(uid, fsid))
					.chain(Key =>
						Oath.of(new PassThrough())
							.tap(stream => content.pipe(stream))
							.map(
								Body =>
									new Upload({
										client: s3,
										params: { Bucket, Key, Body },
									}),
							)
							.chain(upload => Oath.from(() => upload.done()))
							.chain(() =>
								Oath.from(() =>
									s3.send(
										new GetObjectCommand({
											Bucket,
											Key,
										}),
									),
								),
							),
					)
					.map(() => length),
		}
	},
}

// --- Internal ---

/**
 * Creates a bucket object key from user id and fs id.
 */
const getKey = (uid: UserID, fsid: FSID) => `${uid}/${fsid}`
