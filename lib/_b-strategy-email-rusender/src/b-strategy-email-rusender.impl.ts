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

import * as LIB from "./b-strategy-email-rusender.constants"
import type * as Lib from "./b-strategy-email-rusender.types"

export const create: Lib.Create = (k, s) => ({
	send: (idempotencyKey, subject, html, to, from = s, previewTitle, headers, cc, bcc) =>
		oath
			.all([
				oath.try_catch(() =>
					JSON.stringify({ idempotencyKey, mail: { bcc, cc, from, headers, html, previewTitle, subject, to } }),
				),
				oath
					.of(new Headers())
					.pipe(oath.ops.tap(h => h.set("Content-Type", "application/json")))
					.pipe(oath.ops.tap(h => h.set(LIB.X_API_KEY_HEADER_KEY, k))),
			])
			.pipe(oath.ops.chain(([body, headers]) => oath.from_promise(() => fetch(LIB.URL, { method: LIB.METHOD, body, headers }))))
			.pipe(oath.ops.chain(r => oath.if_else(r.status <= 299)))
			.pipe(oath.ops.rmap(ordo.rrr.eio(ORDO.RRR.REASON.EMAIL_STRATEGY_FAILED))),

	kill: () => void 0,
})
