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

import { resolve } from "path"

import {
	Data,
	type DataNotFound,
	type DataPersistenceStrategy,
	type DataUnexpectedError,
	type FSID,
	type PlainData,
	UnexpectedError,
} from "@ordo-pink/data"
import { createParentIfNotExists0, fileExists0, readFile0, writeFile0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"

type Params = { root: string }

/**
 * `DataPersistenceStrategyFS` implements `DataPersistenceStrategy` for storing data using
 * file system. To create a `DataPersistenceStrategyFS`, you need to provide the root directory
 * where all the data will be stored. This strategy will automatically create the root directory
 * if it does not exist.
 *
 * @warning This strategy is not intended to be used in production.
 *
 * @example
 * const dataPersistenceStrategy = DataPersistenceStrategyFS.of({
 *   root: "/var/ordo/data",
 * })
 */
export const DataPersistenceStrategyFS = {
	/**
	 * `DataPersistenceStrategyFS` factory.
	 */
	of: ({ root }: Params): DataPersistenceStrategy => ({
		count: uid => read0(root, uid).map(arr => arr.length),
		find: (uid, name, parent) => read0(root, uid).chain(findDataByNameAndParent0(name, parent)),
		create: plain =>
			read0(root, plain.createdBy)
				.map(data => [...data, plain])
				.map(data => data.sort(sortByNameDesc))
				.chain(write0(root, plain.createdBy))
				.map(() => plain),
		delete: (uid, fsid) => read0(root, uid).map(dropByFSID(fsid)).chain(write0(root, uid)),
		exists: (uid, fsid) =>
			read0(root, uid)
				.map(checkExists(fsid))
				.fix(() => false),
		get: (uid, fsid) => read0(root, uid).chain(findByFSID0(fsid)),
		getAll: uid => read0(root, uid),
		update: plain =>
			read0(root, plain.createdBy).chain(data =>
				Oath.of(data.findIndex(item => item.fsid === plain.fsid))
					.chain(Oath.ifElse(x => x >= 0, { onFalse: () => Data.Errors.DataNotFound }))
					.map(replaceByIndex(data, plain))
					.chain(write0(root, plain.createdBy))
					.map(() => "OK"),
			),
	}),
}

// --- Internal ---

const getPath = (root: string, uid: string): string => resolve(root, `${uid}.json`)

const findDataByNameAndParent0 =
	(name: string, parent: FSID | null) =>
	(data: PlainData[]): Oath<PlainData, DataNotFound> =>
		Oath.fromNullable(data.find(item => item.name === name && item.parent === parent)).rejectedMap(
			() => Data.Errors.DataNotFound,
		)

const readDataFile0 = (path: string): Oath<PlainData[], Error> =>
	readFile0(path, "utf8").chain(content => Oath.try(() => JSON.parse(content as string)))

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

const writeDataFile0 =
	(content: PlainData[]) =>
	(path: string): Oath<void, Error> =>
		writeFile0(path, JSON.stringify(content, null, 2), "utf-8")

const createParentDirIfNotExists0 = (path: string): Oath<string, Error> =>
	createParentIfNotExists0(path).map(() => path)

const createDataFileIfNotExists0 = (path: string): Oath<string, Error> =>
	fileExists0(path).chain(exists =>
		exists ? Oath.of(path) : writeFile0(path, "[]", "utf-8").map(() => path),
	)

const read0 = (root: string, uid: string): Oath<PlainData[], DataUnexpectedError> =>
	Oath.of(getPath(root, uid))
		.chain(createParentDirIfNotExists0)
		.chain(createDataFileIfNotExists0)
		.chain(readDataFile0)
		.rejectedMap(UnexpectedError)

const write0 =
	(root: string, uid: string) =>
	(content: PlainData[]): Oath<"OK", DataUnexpectedError> =>
		Oath.of(getPath(root, uid))
			.chain(createParentDirIfNotExists0)
			.chain(createDataFileIfNotExists0)
			.chain(writeDataFile0(content))
			.bimap(UnexpectedError, () => "OK")

const sortByNameDesc = (a: PlainData, b: PlainData) =>
	a.name < b.name ? -1 : a.name > b.name ? 1 : 0
