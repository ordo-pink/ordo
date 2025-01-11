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

import { Oath, ops0 } from "@ordo-pink/oath"
import { RRR } from "../../../../core/src/rrr"

const INDEXEDDB_NAME = "ordo"
const INDEXEDDB_OBJECT_STORE_NAME = "ordo_db"
const INDEXEDDB_OBJECT_STORE_VERSION = 3

// TODO Move to frontend-app
// TODO Persistence strategy support
export const CacheContentRepository: Ordo.Content.RepositoryStatic = {
	Of: () => {
		const indexed_db = indexedDB.open(INDEXEDDB_NAME, INDEXEDDB_OBJECT_STORE_VERSION)

		const db_promise = new Promise<IDBDatabase>((resolve, reject) => {
			indexed_db.onupgradeneeded = () => {
				const db = indexed_db.result
				if (!db.objectStoreNames.contains(INDEXEDDB_OBJECT_STORE_NAME)) db.createObjectStore(INDEXEDDB_OBJECT_STORE_NAME)
			}

			indexed_db.onsuccess = (event: any) => {
				resolve(event.target.result as IDBDatabase)
			}

			indexed_db.onerror = (event: any) => {
				reject(event.target.error?.message ?? "Something wrong with IndexedDB")
			}
		})

		return {
			get: fsid =>
				Oath.FromPromise(() => db_promise)
					.pipe(ops0.chain(db => Oath.FromNullable(db)))
					.pipe(ops0.rejected_map(rrr => eio("Failed to access IndexedDB cache", rrr)))
					.pipe(ops0.chain(db => Oath.Try(() => db.transaction(INDEXEDDB_OBJECT_STORE_NAME, "readonly"))))
					.pipe(ops0.map(transaction => transaction.objectStore(INDEXEDDB_OBJECT_STORE_NAME)))
					.pipe(ops0.map(storage => storage.get(fsid)))
					.pipe(ops0.chain(dbr => new Oath(res => void (dbr.onsuccess = event => res((event.target as any)?.result ?? null)))))
					.fix(() => null) as any, // TODO Fix types

			put: (fsid, content) =>
				Oath.FromPromise(() => db_promise)
					.pipe(ops0.chain(db => Oath.FromNullable(db)))
					.pipe(ops0.rejected_map(() => eio("Failed to access cache inside IndexedDB")))
					.pipe(ops0.map(db => db.transaction(INDEXEDDB_OBJECT_STORE_NAME, "readwrite")))
					.pipe(ops0.map(transaction => transaction.objectStore(INDEXEDDB_OBJECT_STORE_NAME)))
					.pipe(ops0.map(storage => storage.put(content, fsid)))
					.pipe(
						ops0.chain(
							result =>
								new Oath((resolve, reject) => {
									result.onsuccess = () => resolve(void 0)
									result.onerror = () => reject(eio("Failed to access cache inside IndexedDB"))
								}),
						),
					),
		}
	},
}

const LOCATION = "ContentRepository"

const eio = RRR.codes.eio(LOCATION)
