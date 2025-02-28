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
import { BackendUser } from "@ordo-pink/backend/src/backend.impl"
import { RRR } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"

import { type TIDContext } from "../backend-id.types"

export const get_user_from_cookie = (intake: TIntake<TIDContext>) =>
	Oath.FromNullable(intake.req.headers.get("Cookie"))
		.and(cookie => cookie.split("/"))
		.and(([uid, sid]) =>
			Oath.If(BackendUser.Validations.is_uid(uid), { T: () => uid as Ordo.User.UID })
				.and(uid => intake.user_persistence_strategy.get_by_id(uid))
				.and(user =>
					Oath.If(
						user.get_sessions().some(session => session[0] === sid),
						{ T: () => user },
					),
				),
		)
		.pipe(ops0.rejected_map(() => ({ rrr: RRR.codes.enoent("User not found"), intake })))
