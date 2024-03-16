// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
