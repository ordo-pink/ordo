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

import { Oath, ops0 } from "@ordo-pink/oath"
import { rrr } from "@ordo-pink/core"

export const PersistenceStrategyContentOrdoBackend = {
	Of: (dt_host: string, fetch: Ordo.Fetch): Ordo.Content.PersistenceStrategy => {
		return {
			clear: () => Oath.Reject(rrr.codes.eio("NOT IMPLEMENTED")),
			delete: (uid, fsid) =>
				Oath.FromPromise(() => fetch(`${dt_host}/${uid}/${fsid}`, { credentials: "include", method: "DELETE" }))
					.and(res => res.json())
					.and(res => Oath.If(res.success))
					.pipe(ops0.rejected_map((e: Error) => rrr.codes.eio(e?.message, e))), // TODO
			exists: () => Oath.Reject(rrr.codes.eio("NOT IMPLEMENTED")),
			list: () => Oath.Reject(rrr.codes.eio("NOT IMPLEMENTED")),
			get: (uid, fsid) =>
				Oath.FromPromise(() => fetch(`${dt_host}/${uid}/${fsid}`, { credentials: "include" }))
					.and(res => Oath.If(res.status === 200, { T: () => res }))
					.and(res => res.body)
					.pipe(ops0.rejected_map((e: Error) => rrr.codes.eio(e?.message, e))),
			put: (uid, fsid, body) =>
				Oath.FromPromise(() =>
					fetch(`${dt_host}/${uid}/${fsid}`, { credentials: "include", method: "PUT", body: body as ArrayBuffer }),
				)
					.and(res => Oath.If(res.status === 200 || res.status === 404))
					.pipe(ops0.rejected_map((e: Error) => rrr.codes.eio(e?.message, e))),
		}
	},
}
