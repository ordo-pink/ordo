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

import type { Session } from "../b-server-id.types"

export const create: Session.CreateService = (sr, l) => ({
	get_sessions0: uid => sr.read(uid),
	sign_in0: ordo.fns.curry((uid, info) => sr.create(uid, info)),
	sign_out0: ordo.fns.curry((uid, sid) => sr.delete(uid, sid)),
	verify0: ordo.fns.curry((uid, sid) =>
		sr
			.read(uid)
			.pipe(
				oath.ops.map(sessions =>
					sessions.find(
						session =>
							ordo.session.server.get_id(session) === sid &&
							ordo.timestamp.is_after(Date.now() - l * 60 * 1000, ordo.session.get_issued_at(session)),
					),
				),
			)
			.pipe(oath.ops.chain(s => oath.from_nullable(s, ordo.rrr.enoent(ORDO.RRR.REASON.SESSION_MISSING_OR_EXPIRED)))),
	),
	kill: () => void sr.kill(),
})
