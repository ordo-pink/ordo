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

import { oath } from "@ordo-pink/oath"
import { rrr } from "@ordo-pink/core"

export const PersistenceStrategyContentOrdoBackend = {
	Of: (dt_host: string, fetch: Ordo.Fetch): Ordo.Content.PersistenceStrategy => {
		return {
			clear: () => oath.reject(rrr.codes.eio("NOT IMPLEMENTED")),
			delete: (uid, fsid) =>
				oath
					.from_promise(() => fetch(`${dt_host}/${uid}/${fsid}`, { credentials: "include", method: "DELETE" }))
					.pipe(oath.ops.and(res => res.json()))
					.pipe(oath.ops.and(res => oath.if(res.success)))
					.pipe(oath.ops.rmap(e => rrr.codes.eio("Failed to delete content", e))), // TODO
			exists: () => oath.reject(rrr.codes.eio("NOT IMPLEMENTED")),
			list: () => oath.reject(rrr.codes.eio("NOT IMPLEMENTED")),
			get: (uid, fsid) =>
				oath
					.from_promise(() => fetch(`${dt_host}/${uid}/${fsid}`, { credentials: "include" }))
					.pipe(oath.ops.and(res => oath.if(res.status === 200, { on_true: () => res })))
					.pipe(oath.ops.and(res => res.body))
					.pipe(oath.ops.rmap(e => rrr.codes.eio("Failed to get content", e))),
			put: (uid, fsid, body) =>
				oath
					.of({ credentials: "include", method: "PUT", body: body as ArrayBuffer } as const)
					.pipe(oath.ops.and(init => oath.from_promise(() => fetch(`${dt_host}/${uid}/${fsid}`, init))))
					.pipe(oath.ops.and(res => oath.if(res.status === 200 || res.status === 404)))
					.pipe(oath.ops.rmap(e => rrr.codes.eio("Failed to set content", e))),
		}
	},
}
