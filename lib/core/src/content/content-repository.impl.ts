import { Oath, ops0 } from "@ordo-pink/oath"
import { RRR } from "../rrr"

export const CacheContentRepository: Ordo.Content.RepositoryAsyncStatic = {
	Of: () => {
		const indexed_db = indexedDB.open("ordo.pink", 2)

		const result_p = new Promise<IDBDatabase>((resolve, reject) => {
			indexed_db.onupgradeneeded = () => {
				const db = indexed_db.result
				if (!db.objectStoreNames.contains("content")) {
					db.createObjectStore("content")
				}
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
				Oath.FromPromise(() => result_p)
					.pipe(ops0.chain(db => Oath.FromNullable(db)))
					.pipe(ops0.rejected_map(rrr => eio("Failed to access IndexedDB cache", rrr)))
					.pipe(ops0.map(db => db.transaction("content", "readonly")))
					.pipe(ops0.map(transaction => transaction.objectStore("content")))
					.pipe(ops0.map(storage => storage.get(fsid)))
					.pipe(
						ops0.chain(
							result =>
								new Oath((resolve, reject) => {
									result.onsuccess = event => resolve((event.target as any)?.result ?? null)
									result.onerror = () => reject(eio("Failed to access cache inside IndexedDB"))
								}),
						),
					),
			put: (fsid, content) =>
				Oath.Try(() => indexed_db.result)
					.pipe(ops0.chain(db => Oath.FromNullable(db)))
					.pipe(ops0.rejected_map(() => eio("Failed to access cache inside IndexedDB")))
					.pipe(ops0.map(db => db.transaction("content", "readwrite")))
					.pipe(ops0.map(transaction => transaction.objectStore("content")))
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
