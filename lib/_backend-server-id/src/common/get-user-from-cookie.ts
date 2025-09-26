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

import { type Session, type User, rrr, user } from "@ordo-pink/sdk-core"
import { huyami } from "@ordo-pink/sdk-server-routary"
import { oath } from "@ordo-pink/oss-oath"

import type { ServerID } from "../backend-server-id.types"

export const get_user_from_cookie = (intake: ServerID.Intake) => {
	const debug = huyami(intake)

	return oath
		.from_nullable(intake.req.headers.get("Cookie"))
		.pipe(oath.ops.map(cookie => cookie.split("=")))
		.pipe(
			oath.ops.chain(([uid, sid]) =>
				oath
					.merge({
						uid: oath.if_else(user.current.validations.is_id(uid), { t: () => uid as User.ID }),
						sid: oath.if_else(user.current.validations.is_id(sid), { t: () => sid as Session.ID }),
					})
					.pipe(oath.ops.tap(debug("Cookie extracted", ({ uid }) => uid)))
					.pipe(
						oath.ops.chain(({ uid, sid }) =>
							intake.persistence_strategy_user
								.read(uid)
								.pipe(
									oath.ops.chain(user =>
										oath.if_else(
											user.get_sessions().some(session => session.has_id(sid)),
											{ t: () => ({ user, uid, sid }) },
										),
									),
								)
								.pipe(oath.ops.tap(debug("User and session are valid", ({ uid }) => uid))),
						),
					),
			),
		)
		.pipe(oath.ops.rmap(() => ({ rrr: rrr.enoent("User not found"), intake })))
}
