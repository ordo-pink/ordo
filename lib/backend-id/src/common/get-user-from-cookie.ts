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

import { CurrentUser, CurrentUserKeys, RRR } from "@ordo-pink/core"
import { Oath, ops0 } from "@ordo-pink/oath"
import { type Routary } from "@ordo-pink/routary"

import { type TIDContext } from "../backend-id.types"
import { huyami } from "@ordo-pink/routary-ordo"

export const get_user_from_cookie = (intake: Routary.Intake<TIDContext>) => {
	const debug = huyami(intake)

	return Oath.FromNullable(intake.req.headers.get("Cookie"))
		.and(cookie => cookie.split("="))
		.and(([uid, sid]) =>
			Oath.Merge({
				uid: Oath.If(CurrentUser.Validations.is_uid(uid), { T: () => uid as Ordo.User.UID }),
				sid: Oath.If(CurrentUser.Validations.is_uid(sid), { T: () => sid as Ordo.User.SessionID }),
			})
				.pipe(ops0.tap(debug("Cookie extracted", ({ uid }) => uid)))
				.and(({ uid, sid }) =>
					intake.persistence_strategy_user
						.read(uid)
						.and(user =>
							Oath.If(
								user.get_sessions().some(session => session[0] === sid),
								{ T: () => ({ user, uid, sid }) },
							),
						)
						.pipe(ops0.tap(debug("User and session are valid", ({ uid }) => uid)))
						.and(params =>
							Oath.Resolve(params.user)
								.and(user => user.to_dto())
								.pipe(
									ops0.tap(
										dto =>
											void (dto[CurrentUserKeys.SESSIONS] = dto[CurrentUserKeys.SESSIONS].toSpliced(
												dto[CurrentUserKeys.SESSIONS].findIndex(session => session[0] === sid),
												1,
												[sid, Date.now()],
											)),
									),
								)
								.and(dto => ({ uid, sid, user: CurrentUser.FromDTO(dto) })),
						)
						.and(({ user, uid, sid }) =>
							intake.persistence_strategy_user.update(user.get_uid(), user).and(user => ({ user, uid, sid })),
						)
						.pipe(ops0.tap(debug("Current session updated"))),
				),
		)
		.pipe(ops0.rejected_map(() => ({ rrr: RRR.codes.enoent("User not found"), intake })))
}
