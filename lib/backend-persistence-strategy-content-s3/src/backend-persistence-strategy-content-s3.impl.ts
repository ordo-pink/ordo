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

import { DeleteObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { PassThrough, Readable } from "stream"
import { Upload } from "@aws-sdk/lib-storage"

import { ContentPersistenceStrategy, Data, FSID, UnexpectedError, UserID } from "@ordo-pink/managers"
import { Oath } from "@ordo-pink/oath"
import { bimap_oath } from "@ordo-pink/oath/operators/bimap"
import { chain_oath } from "@ordo-pink/oath/operators/chain"
import { from_promise_oath } from "@ordo-pink/oath/constructors/from-promise"
import { map_oath } from "@ordo-pink/oath/operators/map"
import { rejected_map_oath } from "@ordo-pink/oath/operators/rejected-map"
import { tap_oath } from "@ordo-pink/oath/operators/tap"

import { S3DownloadStream } from "./s3-download-stream"
import { type TPersistenceStrategyContentS3Params } from "./backend-persistence-strategy-content-s3.types"

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
	}: TPersistenceStrategyContentS3Params): ContentPersistenceStrategy<Readable> => {
		const s3 = new S3Client({ region, endpoint, credentials: { accessKeyId, secretAccessKey } })

		return {
			create: () => Oath.Resolve("OK"),

			delete: (uid, fsid) =>
				Oath.Resolve(getKey(uid, fsid))
					.pipe(chain_oath(s3DeleteObject0(s3, bucketName)))
					.pipe(bimap_oath(dataNotFound, ok)),

			read: (uid, fsid) =>
				Oath.Resolve(getKey(uid, fsid))
					.pipe(map_oath(s3ReadObject0(s3, bucketName)))
					.fix(getEmptyReadableStream),

			write: (uid, fsid, content, length) =>
				Oath.Resolve(getKey(uid, fsid))
					.pipe(chain_oath(s3WriteObject0(s3, bucketName, content)))
					.pipe(map_oath(() => length)),
		}
	},
}

// --- Internal ---

const ok = () => "OK" as const

const dataNotFound = () => Data.Errors.DataNotFound

const getEmptyReadableStream = () => Readable.from([""])

const s3DeleteObject0 = (s3: S3Client, Bucket: string) => (Key: string) =>
	from_promise_oath(() => s3.send(new DeleteObjectCommand({ Bucket, Key })))

const s3ReadObject0 = (s3: S3Client, Bucket: string) => (Key: string) => new S3DownloadStream({ Key, Bucket, s3 })

const s3WriteObject0 = (s3: S3Client, Bucket: string, content: Readable) => (Key: string) =>
	Oath.Resolve(new PassThrough())
		.pipe(tap_oath(stream => content.pipe(stream)))
		.pipe(map_oath(Body => new Upload({ client: s3, params: { Bucket, Key, Body } })))
		.pipe(chain_oath(upload => from_promise_oath(() => upload.done())))
		.pipe(chain_oath(() => from_promise_oath(() => s3.send(new GetObjectCommand({ Bucket, Key })))))
		.pipe(rejected_map_oath(UnexpectedError))

/**
 * Creates a bucket object key from user id and fs id.
 */
const getKey = (uid: UserID, fsid: FSID) => `${uid}/${fsid}`
