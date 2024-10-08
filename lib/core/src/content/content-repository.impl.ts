import { Oath } from "@ordo-pink/oath"
import { RRR } from "../rrr"
import { Result } from "@ordo-pink/result"
import { map } from "rxjs"

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
					.pipe(Oath.ops.chain(db => Oath.FromNullable(db)))
					.pipe(Oath.ops.rejected_map(rrr => eio("Failed to access IndexedDB cache", rrr)))
					.pipe(Oath.ops.map(db => db.transaction("content", "readonly")))
					.pipe(Oath.ops.map(transaction => transaction.objectStore("content")))
					.pipe(Oath.ops.map(storage => storage.get(fsid)))
					.pipe(
						Oath.ops.chain(
							result =>
								new Oath((resolve, reject) => {
									result.onsuccess = event => resolve((event.target as any)?.result ?? null)
									result.onerror = () => reject(eio("Failed to access cache inside IndexedDB"))
								}),
						),
					),
			put: (fsid, content) =>
				Oath.Try(() => indexed_db.result)
					.pipe(Oath.ops.chain(db => Oath.FromNullable(db)))
					.pipe(Oath.ops.rejected_map(() => eio("Failed to access cache inside IndexedDB")))
					.pipe(Oath.ops.map(db => db.transaction("content", "readwrite")))
					.pipe(Oath.ops.map(transaction => transaction.objectStore("content")))
					.pipe(Oath.ops.map(storage => storage.put(content, fsid)))
					.pipe(
						Oath.ops.chain(
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
const einval = RRR.codes.einval(LOCATION)
