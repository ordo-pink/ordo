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

import type { Wjwt } from "@ordo-pink/oss-wjwt"

import type { Token } from "../b-server-id.types"

export const create: Token.CreateService = wjwt => ({
	create0: (uid, sid) =>
		oath
			.from_promise(() => wjwt.sign({ sub: uid, jti: sid }))
			.pipe(oath.ops.map(r => r[0]))
			.pipe(oath.ops.rmap(ordo.rrr.eio(ORDO.RRR.REASON.INVALID_SERVICE_INITIALIZATION))),

	verify0: token_str =>
		oath
			.from_nullable(token_str)
			.pipe(oath.ops.chain(t => oath.from_promise(() => wjwt.verify(t))))
			.pipe(oath.ops.rmap(ordo.rrr.einval(ORDO.RRR.REASON.INVALID_TOKEN)))
			.pipe(oath.ops.chain(v => oath.if_else(v, { f: ordo.rrr.eio(ORDO.RRR.REASON.INVALID_TOKEN) })))
			.pipe(oath.ops.map(() => wjwt.decode(token_str as Wjwt.TokenString))),
})
