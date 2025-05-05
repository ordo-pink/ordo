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

import { current_user } from "@ordo-pink/core"
import { default_handler } from "@ordo-pink/routary-ordo"
import { oath } from "@ordo-pink/oath"

import { type TIDContext } from "../../backend-server-id.types"
import { get_user_from_cookie } from "../../common/get-user-from-cookie"

export const handle_get_session = default_handler<TIDContext>(intake => {
	return get_user_from_cookie(intake)
		.pipe(oath.ops.map(({ user }) => user.to_dto()))
		.pipe(oath.ops.map(current_user.serialize))
		.pipe(oath.ops.map(dto => void (intake.payload = dto)))
		.pipe(oath.ops.map(() => intake))
})
