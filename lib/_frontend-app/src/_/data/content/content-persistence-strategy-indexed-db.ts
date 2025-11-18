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

import { IndexedDBStorePromise } from "@ordo-pink/indexeddb-promise"
import { noop } from "@ordo-pink/_tau"
import { oath } from "@ordo-pink/oss-oath"
import { rrr } from "@ordo-pink/_core"

export const PersistenceStrategyContentIndexedDB = {
	Of: (
		db_name: string,
		store_name: string,
		db_version: number,
		on_upgrade_needed: (indexed_db: IDBOpenDBRequest) => (event: IDBVersionChangeEvent) => any,
	): Ordo.Content.PersistenceStrategy => {
		const indexed_db = indexedDB.open(db_name, db_version)

		const eio = (e: unknown) => rrr.codes.eio("IndexedDB Error", e)

		const db_promise = new Promise<IDBDatabase>((resolve, reject) => {
			indexed_db.onupgradeneeded = on_upgrade_needed(indexed_db)

			indexed_db.onsuccess = (event: any) => {
				resolve(event.target.result as IDBDatabase)
			}

			indexed_db.onerror = (event: any) => {
				reject(event.target.error?.message ?? "Something wrong with IndexedDB")
			}
		})

		const store0 = oath
			.of(() => db_promise)
			.pipe(oath.ops.and(f => oath.from_promise(f).pipe(oath.ops.rmap(eio))))
			.pipe(oath.ops.and(db => oath.from_nullable(db, () => eio(new Error("Could not establish IndexedDB connection")))))
			.pipe(oath.ops.and(db => oath.try_catch(() => db.transaction([store_name], "readwrite"))))
			.pipe(oath.ops.and(transaction => oath.try_catch(() => transaction.objectStore(store_name), eio)))
			.pipe(oath.ops.and(store => IndexedDBStorePromise.Of(store)))

		return {
			clear: () => store0.pipe(oath.ops.and(s => s.clear())).pipe(oath.ops.rmap(eio)),
			delete: (uid, fsid) => store0.pipe(oath.ops.and(s => s.delete(get_path(uid, fsid)))).pipe(oath.ops.rmap(eio)),
			exists: (uid, fsid) =>
				store0
					.pipe(oath.ops.and(s => s.count(get_path(uid, fsid))))
					.pipe(oath.ops.and(count => count > 0))
					.pipe(oath.ops.rmap(eio)),
			get: (uid, fsid) => store0.pipe(oath.ops.and(s => s.get(get_path(uid, fsid)))).pipe(oath.ops.rmap(eio)),
			list: () =>
				store0
					.pipe(oath.ops.and(s => s.get_all_keys()))
					.pipe(
						oath.ops.and(keys =>
							oath.merge(
								keys.reduce((acc, key) => ({ ...acc, [key as string]: store0.pipe(oath.ops.and(s => s.get(key))) }), {}),
							),
						),
					)
					.pipe(oath.ops.rmap(eio)),
			put: (uid, fsid, content) =>
				store0
					.pipe(oath.ops.and(s => s.put(content, get_path(uid, fsid))))
					.pipe(oath.ops.and(noop))
					.pipe(oath.ops.rmap(eio)),
		}
	},
}

const get_path = (uid: Ordo.User.UID, fsid: Ordo.Metadata.FSID) => `${fsid}`
