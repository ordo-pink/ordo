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

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Readable } from "stream"
import { Upload } from "@aws-sdk/lib-storage"

import {
	Data,
	type DataNotFound,
	type DataPersistenceStrategy,
	type DataUnexpectedError,
	type FSID,
	type PlainData,
	UnexpectedError,
	type UserID,
} from "@ordo-pink/data"
import { Oath } from "@ordo-pink/oath"

type Params = {
	accessKeyId: string
	secretAccessKey: string
	region: string
	bucketName: string
	endpoint?: string
}

/**
 * `DataPersistenceStrategyS3` implements `DataPersistenceStrategy` for storing data using AWS S3.
 *
 * @example
 * const dataPersistenceStrategy = DataPersistenceStrategyS3.of({
 *   accessKeyId: "YOUR_ACCESS_KEY",
 *   secretAccessKey: "YOUR_SECRET_KEY",
 *   region: "us-east-1",
 *   endpoint: "YOUR_AWS_ENDPOINT",
 *   bucketName: "data-test-bucket"
 * })
 */
export const DataPersistenceStrategyS3 = {
	/**
	 * `DataPersistenceStrategyFS` factory.
	 */
	of: ({
		accessKeyId,
		secretAccessKey,
		region,
		endpoint,
		bucketName,
	}: Params): DataPersistenceStrategy => {
		const s3 = new S3Client({ region, endpoint, credentials: { accessKeyId, secretAccessKey } })
		const Bucket = bucketName

		return {
			count: uid =>
				read0(s3, uid, Bucket)
					.map(arr => arr.length)
					.fix(() => 0),
			find: (uid, name, parent) =>
				read0(s3, uid, Bucket).chain(findDataByNameAndParent0(name, parent)),
			create: plain =>
				read0(s3, plain.createdBy, Bucket)
					.fix(() => [])
					.map(data => [plain, ...data])
					.chain(write0(s3, plain.createdBy, Bucket))
					.map(() => plain),
			delete: (uid, fsid) =>
				read0(s3, uid, Bucket)
					.map(dropByFSID(fsid))
					.chain(write0(s3, uid, Bucket)),
			exists: (uid, fsid) =>
				read0(s3, uid, Bucket)
					.map(checkExists(fsid))
					.fix(() => false),
			get: (uid, fsid) => read0(s3, uid, Bucket).chain(findByFSID0(fsid)),
			getAll: uid => read0(s3, uid, Bucket).fix(() => []),
			update: plain =>
				read0(s3, plain.createdBy, Bucket).chain(data =>
					Oath.of(data.findIndex(item => item.fsid === plain.fsid))
						.chain(Oath.ifElse(x => x >= 0, { onFalse: () => Data.Errors.DataNotFound }))
						.map(replaceByIndex(data, plain))
						.chain(write0(s3, plain.createdBy, Bucket))
						.map(() => "OK"),
				),
		}
	},
}

// --- Internal ---

/**
 * Creates a bucket object key from user id.
 */
const getKey = (uid: UserID) => `${uid}.json`

const write0 =
	(s3: S3Client, uid: UserID, Bucket: string) =>
	(content: PlainData[]): Oath<"OK", DataUnexpectedError> =>
		Oath.of(getKey(uid))
			.chain(Key =>
				Oath.try(() => JSON.stringify(content))
					.map(Body => new Upload({ client: s3, params: { Bucket, Key, Body } }))
					.chain(upload => Oath.from(() => upload.done())),
			)
			.bimap(UnexpectedError, () => "OK")

const read0 = (s3: S3Client, uid: UserID, Bucket: string): Oath<PlainData[], DataUnexpectedError> =>
	Oath.of(getKey(uid))
		.map(Key => new GetObjectCommand({ Bucket, Key }))
		.chain(command => Oath.from(() => s3.send(command)))
		.chain(result =>
			Oath.from(
				() =>
					new Promise<string>((resolve, reject) => {
						if (!result.Body) return resolve("[]")

						const readable = result.Body as Readable
						const chunks = [] as any[]

						readable
							.on("data", chunk => chunks.push(chunk))
							.once("error", error => reject(error))
							.once("end", () => resolve(chunks.join("")))
					}),
			),
		)
		.chain(dataFile => Oath.try(() => JSON.parse(dataFile)))
		.rejectedMap(UnexpectedError)

const findDataByNameAndParent0 =
	(name: string, parent: FSID | null) =>
	(data: PlainData[]): Oath<PlainData, DataNotFound> =>
		Oath.fromNullable(data.find(item => item.name === name && item.parent === parent)).rejectedMap(
			() => Data.Errors.DataNotFound,
		)

const replaceByIndex = (data: PlainData[], newItem: PlainData) => (index: number) => {
	data.splice(index, 1, newItem)
	return data
}

const dropByFSID = (fsid: FSID) => (data: PlainData[]) => data.filter(item => item.fsid !== fsid)

const checkExists = (fsid: FSID) => (data: PlainData[]) => data.some(item => item.fsid === fsid)

const findByFSID0 = (fsid: FSID) => (data: PlainData[]) =>
	Oath.fromNullable(data.find(item => item.fsid === fsid)).rejectedMap(
		() => Data.Errors.DataNotFound,
	)
