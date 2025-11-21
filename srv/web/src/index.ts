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

import { client_app } from "@ordo-pink/client-app"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"

const body = document.querySelector("body")

const hosts: Ordo.Hosts = {
	id: import.meta.env.VITE_ORDO_ID_HOST!,
	dt: import.meta.env.VITE_ORDO_DT_HOST!,
	pb: import.meta.env.VITE_ORDO_PB_HOST!,
	fn: import.meta.env.VITE_ORDO_FN_HOST!,
	web: import.meta.env.VITE_ORDO_WEB_HOST!,
}

const create_id = () => {
	let id = 0
	return () => id++
}

const native_fetch = globalThis.fetch

globalThis.window.fetch = undefined as any
globalThis.XMLHttpRequest = undefined as any
globalThis.XMLHttpRequestUpload = undefined as any

const idb_promise = new Promise<IDBDatabase>((resolve, reject) => {
	const req = window.indexedDB.open("ordo", 1)

	req.onupgradeneeded = () => {
		const db = req.result
		db.createObjectStore("data")
		db.createObjectStore("content")
	}

	req.onsuccess = () => resolve(req.result)
	req.onerror = () => reject(req.error)
})

const idb0 = oath.from_promise(() => idb_promise).pipe(oath.ops.rmap(ordo.rrr.eio(ORDO.RRR.REASON.REPOSITORY_ISSUE)))

const ROOT_DATA_ID = ORDO.UUID.FIRSTBORN

const create_data_repository = (): OrdoClient.Data.Repository => {
	void idb0.cata(oath.catas.to_promise())

	return {
		kill: () => {
			idb0.cancel("DataRepository killed")
			void idb_promise.then(db => db.close())
		},

		read: (id = ROOT_DATA_ID) =>
			idb0.pipe(
				oath.ops.chain(db =>
					oath.create((resolve, reject) => {
						const idb_request = db.transaction("data", "readonly").objectStore("data").get(id)

						idb_request.onsuccess = () => resolve(idb_request.result ?? null)
						idb_request.onerror = () => reject(ordo.rrr.eio(ORDO.RRR.REASON.REPOSITORY_ISSUE, idb_request.error))
					}),
				),
			),

		write: ordo.fns.curry((data, id = ROOT_DATA_ID) =>
			idb0.pipe(
				oath.ops.chain(db =>
					oath.create((resolve, reject) => {
						const idb_request = db
							.transaction("data", "readwrite")
							.objectStore("data")
							.put(data, id as string)

						idb_request.onsuccess = () => resolve()
						idb_request.onerror = () => reject(ordo.rrr.eio(ORDO.RRR.REASON.REPOSITORY_ISSUE, idb_request.error))
					}),
				),
			),
		),
	}
}

body &&
	maoka_dom
		.render(
			body,
			client_app.create({
				hosts,
				fetch: native_fetch,
				content_repository: null as any,
				data_repository: create_data_repository(),
			}),
			create_id(),
		)
		.catch(ordo.logger.error)
