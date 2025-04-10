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

import { CurrentUser, CurrentUserKeys, rrr } from "@ordo-pink/core"
import { type Routary } from "@ordo-pink/routary"
import { oath } from "@ordo-pink/oath"

import { type TIDContext } from "../backend-server-id.types"
import { huyami } from "@ordo-pink/routary-ordo"

export const get_user_from_cookie = (intake: Routary.Intake<TIDContext>) => {
	const debug = huyami(intake)

	return oath
		.from_nullable(intake.req.headers.get("Cookie"))
		.pipe(oath.ops.and(cookie => cookie.split("=")))
		.pipe(
			oath.ops.and(([uid, sid]) =>
				oath
					.merge({
						uid: oath.if(CurrentUser.Validations.is_uid(uid), { on_true: () => uid as Ordo.User.UID }),
						sid: oath.if(CurrentUser.Validations.is_uid(sid), { on_true: () => sid as Ordo.User.SessionID }),
					})
					.pipe(oath.ops.tap(debug("Cookie extracted", ({ uid }) => uid)))
					.pipe(
						oath.ops.and(({ uid, sid }) =>
							intake.persistence_strategy_user
								.read(uid)
								.pipe(
									oath.ops.and(user =>
										oath.if(
											user.get_sessions().some(session => session[0] === sid),
											{ on_true: () => ({ user, uid, sid }) },
										),
									),
								)
								.pipe(oath.ops.tap(debug("User and session are valid", ({ uid }) => uid)))
								.pipe(
									oath.ops.and(params =>
										oath
											.resolve(params.user)
											.pipe(oath.ops.and(user => user.to_dto()))
											.pipe(
												oath.ops.tap(
													dto =>
														void (dto[CurrentUserKeys.SESSIONS] = dto[CurrentUserKeys.SESSIONS].toSpliced(
															dto[CurrentUserKeys.SESSIONS].findIndex(session => session[0] === sid),
															1,
															[sid, Date.now()],
														)),
												),
											)
											.pipe(oath.ops.and(dto => ({ uid, sid, user: CurrentUser.FromDTO(dto) }))),
									),
								)
								.pipe(
									oath.ops.and(({ user, uid, sid }) =>
										intake.persistence_strategy_user
											.update(user.get_uid(), user)
											.pipe(oath.ops.and(user => ({ user, uid, sid }))),
									),
								)
								.pipe(oath.ops.tap(debug("Current session updated"))),
						),
					),
			),
		)
		.pipe(oath.ops.rejected_map(() => ({ rrr: rrr.codes.enoent("User not found"), intake })))
}
