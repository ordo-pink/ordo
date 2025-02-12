import { Oath, ops0 } from "@ordo-pink/oath"
import { IndexedDBStorePromise } from "@ordo-pink/oath-indexeddb"
import { RRR } from "@ordo-pink/core"
import { noop } from "@ordo-pink/tau"

export const PersistenceStrategyContentIndexedDB = {
	Of: (
		db_name: string,
		store_name: string,
		db_version: number,
		on_upgrade_needed: (indexed_db: IDBOpenDBRequest) => (event: IDBVersionChangeEvent) => any,
	): Ordo.Content.PersistenceStrategy => {
		const indexed_db = indexedDB.open(db_name, db_version)

		const eio = (rrr: Error) => RRR.codes.eio("IndexedDB Error", rrr)

		const db_promise = new Promise<IDBDatabase>((resolve, reject) => {
			indexed_db.onupgradeneeded = on_upgrade_needed(indexed_db)

			indexed_db.onsuccess = (event: any) => {
				resolve(event.target.result as IDBDatabase)
			}

			indexed_db.onerror = (event: any) => {
				reject(event.target.error?.message ?? "Something wrong with IndexedDB")
			}
		})

		const store0 = Oath.Resolve(() => db_promise)
			.and(f => Oath.FromPromise(f).pipe(ops0.rejected_map(eio)))
			.and(db => Oath.FromNullable(db, () => eio(new Error("Could not establish IndexedDB connection"))))
			.and(db => Oath.Try(() => db.transaction([store_name], "readwrite"), eio))
			.and(transaction => Oath.Try(() => transaction.objectStore(store_name), eio))
			.and(store => IndexedDBStorePromise.Of(store))

		return {
			clear: () => store0.and(s => s.clear()).pipe(ops0.rejected_map(eio)),
			delete: (uid, fsid) => store0.and(s => s.delete(get_path(uid, fsid))).pipe(ops0.rejected_map(eio)),
			exists: (uid, fsid) =>
				store0
					.and(s => s.count(get_path(uid, fsid)))
					.and(count => count > 0)
					.pipe(ops0.rejected_map(eio)),
			get: (uid, fsid) => store0.and(s => s.get(get_path(uid, fsid))).pipe(ops0.rejected_map(eio)),
			list: () =>
				store0
					.and(s => s.get_all_keys())
					.and(keys => Oath.Merge(keys.reduce((acc, key) => ({ ...acc, [key as string]: store0.and(s => s.get(key)) }), {})))
					.pipe(ops0.rejected_map(eio)),
			put: (uid, fsid, content) =>
				store0
					.and(s => s.put(content, get_path(uid, fsid)))
					.and(noop)
					.pipe(ops0.rejected_map(eio)),
		}
	},
}

const get_path = (uid: Ordo.User.UID, fsid: Ordo.Metadata.FSID) => `${fsid}`
