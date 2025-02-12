/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { TIndexedDBObjectStorePromiseStatic } from "./oath-indexeddb.types"

export const IndexedDBStorePromise: TIndexedDBObjectStorePromiseStatic = {
	Of: store => ({
		add: (value, key) => promisify_idb_request(store.add(value, key)),
		clear: () => promisify_idb_request(store.clear()),
		count: query => promisify_idb_request(store.count(query)),
		delete: query => promisify_idb_request(store.delete(query)),
		get: query => promisify_idb_request(store.get(query)),
		get_all: (query, count) => promisify_idb_request(store.getAll(query, count)),
		get_all_keys: (query, count) => promisify_idb_request(store.getAllKeys(query, count)),
		get_key: query => promisify_idb_request(store.getKey(query)),
		put: (value, key) => promisify_idb_request(store.put(value, key)),
	}),
}

const promisify_idb_request = <T>(req: IDBRequest) =>
	new Promise<T>((resolve, reject) => {
		if (req.transaction) {
			req.transaction.oncomplete = () => resolve(req.result)
			req.transaction.onerror = () => reject(req.error)
			req.transaction.onabort = () => reject(new Error("Transaction aborted"))

			return
		}

		req.onsuccess = () => resolve(req.result)
		req.onerror = () => reject(req.error)
	})
