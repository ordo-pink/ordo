/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
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

import { Context } from "koa"

import { RRR, type TRrr } from "@ordo-pink/managers"
import { type TAuthJWT, type TTokenService } from "@ordo-pink/backend-service-token"
import { type TUserService, UserService } from "@ordo-pink/backend-service-user"
import { authenticate0, parse_body0 } from "@ordo-pink/backend-utils"
import { Oath } from "@ordo-pink/oath"
import { from_option0 } from "@ordo-pink/tau"

import { get_body_first_name0, get_body_last_name0 } from "../fns/getters.fn"

export const update_info0: TFn = (ctx, { token_service, user_service }) =>
	Oath.Merge({
		body: parse_body0<Routes.ID.UpdateInfo.RequestBody>(ctx),
		token: authenticate0(ctx, token_service),
	})
		.pipe(Oath.ops.chain(extract_ctx0(user_service)))
		.pipe(Oath.ops.chain(update_user_info0(user_service)))
		.pipe(Oath.ops.map(body => ({ status: 200, body })))

// --- Internal ---

const LOCATION = "handle_update_info"

const enoent = RRR.codes.enoent(LOCATION)

type TParams = { token_service: TTokenService; user_service: TUserService }
type TFn = (ctx: Context, params: TParams) => Oath<Routes.ID.UpdateInfo.Response, TRrr<"EINVAL" | "ENOENT" | "EIO" | "EACCES">>
type TRequest = { token: TAuthJWT; body: Routes.ID.UpdateInfo.RequestBody }
type TCtx = { user: Ordo.User.Current.Instance; first_name: string; last_name: string }

const extract_ctx0 =
	(user_service: TUserService) =>
	({ body: { first_name, last_name }, token }: TRequest) =>
		Oath.Merge({
			user: user_service
				.get_by_id(token.payload.sub)
				.pipe(Oath.ops.chain(from_option0(() => Oath.Reject(enoent(`extract_ctx -> sub: ${token.payload.sub}`))))),
			first_name: get_body_first_name0(first_name),
			last_name: get_body_last_name0(last_name),
		})

const update_user_info0 =
	(user_service: TUserService) =>
	({ first_name, last_name, user }: TCtx) =>
		user_service
			.update_info(user.id, { first_name, last_name })
			.pipe(Oath.ops.map(() => user))
			.pipe(Oath.ops.map(UserService.serialise))
