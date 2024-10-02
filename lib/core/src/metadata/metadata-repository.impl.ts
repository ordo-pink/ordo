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

import { map } from "rxjs"

import { Oath } from "@ordo-pink/oath"
import { Result } from "@ordo-pink/result"

import { RRR } from "../rrr"

const LOCATION = "MetadataRepository"

const eagain = RRR.codes.eagain(LOCATION)
const einval = RRR.codes.einval(LOCATION)
const eio = RRR.codes.eio(LOCATION)

export const MetadataRepository: Ordo.Metadata.RepositoryStatic = {
	Of: metadata$ => ({
		get: () =>
			Result.Try(() => metadata$.getValue())
				.pipe(Result.ops.chain(Result.FromNullable))
				.pipe(Result.ops.err_map(() => eagain())),

		put: metadata =>
			Result.FromNullable(metadata)
				.pipe(Result.ops.chain(() => Result.If(Array.isArray(metadata), { T: () => metadata }))) // TODO: Add validations
				.pipe(Result.ops.chain(() => Result.Try(() => metadata$.next(metadata))))
				.pipe(Result.ops.err_map(() => einval(`.put: ${JSON.stringify(metadata)}`))),

		get $() {
			let i = -1

			return metadata$.pipe(map(() => ++i))
		},
	}),
}

export const MR = MetadataRepository

// TODO: Add types
// TODO: Add hash and last update
// TODO: Use all three in Manager
export const CacheMetadataRepository: Ordo.Metadata.RepositoryAsyncStatic = {
	Of: () => {
		const indexed_db = indexedDB.open("ordo.pink", 1)

		const result_p = new Promise<IDBDatabase>((resolve, reject) => {
			indexed_db.onupgradeneeded = () => {
				const db = indexed_db.result
				if (!db.objectStoreNames.contains("metadata")) {
					db.createObjectStore("metadata")
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
			get: () =>
				Oath.FromPromise(() => result_p)
					.pipe(Oath.ops.chain(db => Oath.FromNullable(db)))
					.pipe(Oath.ops.rejected_map(rrr => eio("Failed to access IndexedDB cache", rrr)))
					.pipe(Oath.ops.rejected_tap(console.log))
					.pipe(Oath.ops.map(db => db.transaction("metadata", "readonly")))
					.pipe(Oath.ops.map(transaction => transaction.objectStore("metadata")))
					.pipe(Oath.ops.map(storage => storage.get("items")))
					.pipe(
						Oath.ops.chain(
							result =>
								new Oath((resolve, reject) => {
									result.onsuccess = event => resolve((event.target as any)?.result ?? [])
									result.onerror = () => reject(eio("Failed to access cache inside IndexedDB"))
								}),
						),
					),
			put: (_, metadata) =>
				Oath.Try(() => indexed_db.result)
					.pipe(Oath.ops.chain(db => Oath.FromNullable(db)))
					.pipe(Oath.ops.rejected_map(() => eio("Failed to access cache inside IndexedDB")))
					.pipe(Oath.ops.map(db => db.transaction("metadata", "readwrite")))
					.pipe(Oath.ops.map(transaction => transaction.objectStore("metadata")))
					.pipe(Oath.ops.map(storage => storage.put(metadata, "items")))
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

export const RemoteMetadataRepository: Ordo.Metadata.RepositoryAsyncStatic = {
	Of: (data_host, fetch) => ({
		get: token =>
			Oath.Try(() => fetch(`${data_host}`, { headers: { Authorization: `Bearer ${token}` } }))
				.pipe(Oath.ops.chain(response => Oath.FromPromise(() => response.json())))
				.pipe(Oath.ops.chain(r => Oath.If(r.success, { T: () => r.result, F: () => r.error })))
				.pipe(Oath.ops.rejected_map(error => eio(error))),

		put: () => Oath.Reject(eio("TODO: UNIMPLEMENTED")),
	}),
}
