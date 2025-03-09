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
import { BackendUserKeys } from "@ordo-pink/backend"
import { CurrentUser } from "@ordo-pink/core"
import { default_handler } from "@ordo-pink/backend-util-default-handler"

import { type TIDContext } from "../../backend-id.types"
import { get_user_from_cookie } from "../../common/get-user-from-cookie"

export const handle_invalidate_session = default_handler<TIDContext>(intake =>
	get_user_from_cookie(intake)
		.and(({ sid, uid, user }) =>
			Oath.Resolve(user.to_dto())
				.and(dto => {
					const sessions = dto[BackendUserKeys.SESSIONS].filter(session => session[0] !== sid)
					dto[BackendUserKeys.SESSIONS] = sessions

					return intake.user_persistence_strategy.update(uid, dto)
				})
				.and(() => ({ sid, uid, user })),
		)
		.pipe(
			ops0.tap(({ uid, sid }) => {
				intake.headers.set("Set-Cookie", `${uid}=${sid}; Expires=${new Date().toISOString()}`)
			}),
		)
		.and(({ user }) => user.to_dto())
		.and(CurrentUser.Serialize)
		.and(dto => void (intake.payload = dto))
		.and(() => intake),
)
