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

import { default_handler } from "@ordo-pink/sdk-server-routary"
import { oath } from "@ordo-pink/oss-oath"
import { user } from "@ordo-pink/sdk-core"

import type { ServerID } from "../../backend-server-id.types"
import { get_user_from_cookie } from "../../common/get-user-from-cookie"

export const handle_invalidate_session = default_handler<ServerID.Fuel>(intake =>
	get_user_from_cookie(intake)
		.pipe(
			oath.ops.chain(({ sid, uid, user: dto }) =>
				oath
					.of(dto.to_dto())
					.pipe(
						oath.ops.chain(dto => {
							const sessions = dto[10].filter(session => session[0] !== sid)
							dto[10] = sessions

							return intake.persistence_strategy_user.update(uid, user.current.from_dto(...dto))
						}),
					)
					.pipe(oath.ops.rmap(rrr => ({ rrr, intake })))
					.pipe(oath.ops.map(() => ({ sid, uid, user: dto }))),
			),
		)
		.pipe(oath.ops.tap(p => intake.res.headers.set("Set-Cookie", `${p.uid}=${p.sid}; Expires=${new Date().toISOString()}`)))
		.pipe(oath.ops.map(({ user }) => user.to_dto()))
		.pipe(oath.ops.tap(dto => void (intake.res.body = JSON.stringify(dto))))
		.pipe(oath.ops.map(() => intake)),
)
