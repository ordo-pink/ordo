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
} from "@ordo-pink/managers"
import { create_parent_if_not_exists0, file_exists0, read_file0, write_file0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"
import { bimap_oath } from "@ordo-pink/oath/operators/bimap"
import { chain_oath } from "@ordo-pink/oath/operators/chain"
import { from_nullable_oath } from "@ordo-pink/oath/constructors/from-nullable"
import { if_else_oath } from "@ordo-pink/oath/constructors/if-else"
import { map_oath } from "@ordo-pink/oath/operators/map"
import { rejected_map_oath } from "@ordo-pink/oath/operators/rejected-map"
import { try_oath } from "@ordo-pink/oath/constructors/try"

import { type TPersistenceStrategyDataFSParams } from "./backend-persistence-strategy-data-fs.types"

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
	of: ({ root }: TPersistenceStrategyDataFSParams): DataPersistenceStrategy => ({
		count: uid => read0(root, uid).pipe(map_oath(arr => arr.length)),

		find: (uid, name, parent) =>
			read0(root, uid).pipe(chain_oath(findDataByNameAndParent0(name, parent))),

		create: plain =>
			read0(root, plain.createdBy)
				.pipe(map_oath(data => [...data, plain]))
				.pipe(map_oath(data => data.sort(sortByNameDesc)))
				.pipe(chain_oath(write0(root, plain.createdBy)))
				.pipe(map_oath(() => plain)),

		delete: (uid, fsid) =>
			read0(root, uid)
				.pipe(map_oath(dropByFSID(fsid)))
				.pipe(chain_oath(write0(root, uid))),

		exists: (uid, fsid) =>
			read0(root, uid)
				.pipe(map_oath(checkExists(fsid)))
				.fix(() => false),

		get: (uid, fsid) => read0(root, uid).pipe(chain_oath(findByFSID0(fsid))),

		getAll: uid => read0(root, uid),

		update: plain =>
			read0(root, plain.createdBy)
				.pipe(
					chain_oath(data =>
						Oath.Resolve(data.findIndex(item => item.fsid === plain.fsid))
							.pipe(
								chain_oath(if_else_oath(x => x >= 0, { on_false: () => Data.Errors.DataNotFound })),
							)
							.pipe(map_oath(replaceByIndex(data, plain))),
					),
				)
				.pipe(chain_oath(write0(root, plain.createdBy)))
				.pipe(map_oath(ok)),
	}),
}

// --- Internal ---

const ok = () => "OK" as const

const getPath = (root: string, uid: string): string => resolve(root, `${uid}.json`)

const findDataByNameAndParent0 =
	(name: string, parent: FSID | null) =>
	(data: PlainData[]): Oath<PlainData, DataNotFound> =>
		from_nullable_oath(data.find(item => item.name === name && item.parent === parent)).pipe(
			rejected_map_oath(() => Data.Errors.DataNotFound),
		)

const readDataFile0 = (path: string): Oath<PlainData[], Error> =>
	read_file0(path, "utf8").pipe(
		chain_oath(content => try_oath(() => JSON.parse(content as string))),
	)

const replaceByIndex = (data: PlainData[], newItem: PlainData) => (index: number) => {
	data.splice(index, 1, newItem)
	return data
}

const dropByFSID = (fsid: FSID) => (data: PlainData[]) => data.filter(item => item.fsid !== fsid)

const checkExists = (fsid: FSID) => (data: PlainData[]) => data.some(item => item.fsid === fsid)

const findByFSID0 = (fsid: FSID) => (data: PlainData[]) =>
	from_nullable_oath(data.find(item => item.fsid === fsid)).pipe(
		rejected_map_oath(() => Data.Errors.DataNotFound),
	)

const writeDataFile0 =
	(content: PlainData[]) =>
	(path: string): Oath<void, Error> =>
		write_file0(path, JSON.stringify(content, null, 2), "utf-8")

const createParentDirIfNotExists0 = (path: string): Oath<string, Error> =>
	create_parent_if_not_exists0(path).pipe(map_oath(() => path))

const createDataFileIfNotExists0 = (path: string): Oath<string, Error> =>
	file_exists0(path).pipe(
		chain_oath(exists =>
			exists ? Oath.Resolve(path) : write_file0(path, "[]", "utf-8").pipe(map_oath(() => path)),
		),
	)

const read0 = (root: string, uid: string): Oath<PlainData[], DataUnexpectedError> =>
	Oath.Resolve(getPath(root, uid))
		.pipe(chain_oath(createParentDirIfNotExists0))
		.pipe(chain_oath(createDataFileIfNotExists0))
		.pipe(chain_oath(readDataFile0))
		.pipe(rejected_map_oath(UnexpectedError))

const write0 =
	(root: string, uid: string) =>
	(content: PlainData[]): Oath<"OK", DataUnexpectedError> =>
		Oath.Resolve(getPath(root, uid))
			.pipe(chain_oath(createParentDirIfNotExists0))
			.pipe(chain_oath(createDataFileIfNotExists0))
			.pipe(chain_oath(writeDataFile0(content)))
			.pipe(bimap_oath(UnexpectedError, ok))

const sortByNameDesc = (a: PlainData, b: PlainData) =>
	a.name < b.name ? -1 : a.name > b.name ? 1 : 0
