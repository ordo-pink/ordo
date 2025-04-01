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

import { CurrentUser, CurrentUserKeys } from "@ordo-pink/core"
import { Oath, ops0 } from "@ordo-pink/oath"
import { type Routary } from "@ordo-pink/routary"

import { type TIDContext } from "../backend-id.types"

const { SESSIONS } = CurrentUserKeys

export const persist_session_id =
	(i: Routary.Intake<TIDContext>) => (params: { sid: Ordo.User.Session; user: Ordo.User.Current.Instance }) =>
		Oath.Resolve(params.user.to_dto())
			.pipe(ops0.tap(dto => void (dto[SESSIONS] = [...dto[SESSIONS], params.sid])))
			.and(dto => i.persistence_strategy_user.update(params.user.get_uid(), CurrentUser.FromDTO(dto)))
			.and(() => params)
			.pipe(ops0.rejected_map(rrr => ({ rrr, intake: i })))
