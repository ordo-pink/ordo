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

import type * as ServerId from "../b-server-id.types"
import * as common from "../common"

export const get_user_by_ref0: ServerId.RoutaryHandler = ({ env, params }) =>
	common
		.get_param_ref0(params)
		.pipe(oath.ops.chain(env.user_service.get_public_user_by_ref0))
		.pipe(oath.ops.map(ordo.user.to_other_user))
		.pipe(oath.ops.map(Response.json))
		.cata(oath.catas.or_else(env.fail))
