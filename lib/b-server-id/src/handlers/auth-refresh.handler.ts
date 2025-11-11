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

export const auth_refresh: ServerId.RoutaryHandler = async ({ env, request }) =>
	common
		.get_authenticated_user0(request, env)
		.pipe(oath.ops.chain(([s, u]) => env.session_service.refresh0(ordo.user.get_id(u), ordo.session.server.get_id(s))))
		.pipe(
			oath.ops.chain(([s, u]) =>
				env.token_service.create0(ordo.user.get_id(u), ordo.session.server.get_id(s)).pipe(oath.ops.map(t => [u, t])),
			),
		)
		.pipe(
			oath.ops.chain(([u, t]) => oath.of(Response.json(u)).pipe(oath.ops.tap(r => common.set_auth_cookie(r, t[1].exp!, t[0])))),
		)
		.cata(oath.catas.or_else(rrr => env.fail(rrr, new Headers({ "Set-Cookie": "" }))))
