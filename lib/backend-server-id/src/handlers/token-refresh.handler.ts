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

import { type JTI, type SUB } from "@ordo-pink/wjwt"
import { RRR, type TRrr } from "@ordo-pink/managers"
import { type UUIDv4, from_option0 } from "@ordo-pink/tau"
import { Oath } from "@ordo-pink/oath"
import { type TTokenService } from "@ordo-pink/backend-service-token"
import { type TUserService } from "@ordo-pink/backend-service-user"

import { type TCreateAuthTokenResult, create_auth_token0 } from "../fns/create-auth-token.fn"
import { get_auth_cookies0, remove_auth_cookie, set_auth_cookie } from "../fns/auth-cookie.fn"
import { token_result_to_response_body } from "../fns/token-result-to-response-body.fn"

export const token_refresh0: TFn = (ctx, { token_service, user_service }) =>
	get_auth_cookies0(ctx.cookies.get("sub"), ctx.cookies.get("jti"))
		.pipe(Oath.ops.chain(get_user_token0({ user_service, token_service })))
		.pipe(Oath.ops.chain(create_auth_token0(token_service)))
		.pipe(Oath.ops.bitap(remove_auth_cookie(ctx), update_auth_cookie(ctx)))
		.pipe(Oath.ops.map(token_result_to_response_body))
		.pipe(Oath.ops.map(body => ({ status: 200, body })))

// --- Internal ---

type TParams = { user_service: TUserService; token_service: TTokenService }
type TFn = (
	ctx: Context,
	params: TParams,
) => Oath<Routes.ID.RefreshToken.Response, TRrr<"EINVAL" | "EIO" | "EACCES" | "ENOENT">>
type TCtx = { sub: SUB; jti: JTI }

const LOCATION = "handle_refresh_token"

const eacces = RRR.codes.eacces(LOCATION)
const einval = RRR.codes.einval(LOCATION)
const enoent = RRR.codes.enoent(LOCATION)

const verify_token0 = (token_service: TTokenService) => (token: string) =>
	token_service.verify(token, "refresh").pipe(
		Oath.ops.chain(is_valid =>
			Oath.If(is_valid, {
				T: () => token,
				F: () => einval("verify_token -> token invalid"),
			}),
		),
	)

const update_auth_cookie =
	(ctx: Context) =>
	({ expires, jti, user }: TCreateAuthTokenResult) =>
		set_auth_cookie(ctx, user.id, jti, expires)

const get_user_by_id0 = (user_service: TUserService, id: UUIDv4) => () =>
	user_service.get_by_id(id).pipe(Oath.ops.chain(from_option0(() => enoent(`get_user_by_id -> id: ${id}`))))

const get_user_token0 =
	({ user_service, token_service }: TParams) =>
	({ sub, jti }: TCtx) =>
		token_service.strategy
			.get_token(sub, jti)
			.pipe(Oath.ops.chain(from_option0(() => eacces(`get_user_token -> sub: ${sub}, jti: ${jti}`))))
			.pipe(Oath.ops.chain(verify_token0(token_service)))
			.pipe(Oath.ops.chain(get_user_by_id0(user_service, sub)))
