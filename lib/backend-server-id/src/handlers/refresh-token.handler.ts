// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { Context, type Middleware } from "koa"

import { type JTI, type SUB } from "@ordo-pink/wjwt"
import {
	type Oath,
	from_boolean_oath,
	from_nullable_oath,
	merge_oath,
	of_oath,
	rejected_map_oath,
	rejected_tap_oath,
	tap_oath,
} from "@ordo-pink/oath"
import { type UUIDv4, is_uuid } from "@ordo-pink/tau"
import { sendError, sendSuccess } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"
import { type TTokenService } from "@ordo-pink/backend-service-token"
import { type UserService } from "@ordo-pink/backend-service-user"

import { toInvalidRequestError, toUserNotFoundError } from "../fns/to-error"
import { setOrdoAuthCookies } from "../fns/set-cookies"

export const handleRefreshToken: TFn =
	({ tokenService, userService }) =>
	async ctx =>
		merge_oath({
			cookieSub: from_nullable_oath(ctx.cookies.get("sub")).pipe(
				rejected_map_oath(toInvalidRequestError),
			),
			cookieJti: from_nullable_oath(ctx.cookies.get("jti")).pipe(
				rejected_map_oath(toInvalidRequestError),
			),
		})
			.and(validateCtx0)
			.and(getUserByCookies0(userService, tokenService))
			.and(updateUserSession0(ctx, tokenService))
			.pipe(rejected_tap_oath(dropCookies(ctx)))
			.fork(sendError(ctx), sendSuccess({ ctx }))

// --- Internal ---

type TParams = { userService: UserService; tokenService: TTokenService }
type TFn = (params: TParams) => Middleware
type TCtx = { cookieSub: SUB; cookieJti: JTI; user: User.User }
type TResult = Routes.ID.RefreshToken.Result

type ExtractCtxFn = (ctx: {
	cookieSub: string
	cookieJti: string
}) => Oath<{ cookieSub: SUB; cookieJti: JTI }, HttpError>
const validateCtx0: ExtractCtxFn = ({ cookieJti, cookieSub }) =>
	merge_oath({
		cookieSub: from_boolean_oath(is_uuid(cookieSub), cookieSub as SUB).pipe(
			rejected_map_oath(toInvalidRequestError),
		),
		cookieJti: from_boolean_oath(is_uuid(cookieJti), cookieJti as JTI).pipe(
			rejected_map_oath(toInvalidRequestError),
		),
	})

type CheckTokenExists = (token: string | null) => Oath<string, HttpError>
const checkTokenExists0: CheckTokenExists = token =>
	from_nullable_oath(token).pipe(rejected_map_oath(toUserNotFoundError))

type VerifyRefreshTokenFn = (ts: TTokenService) => (token: string) => Oath<string, HttpError>
const verifyRefreshToken0: VerifyRefreshTokenFn = tokenService => token =>
	tokenService
		.verifyToken(token, "refresh")
		.and(valid => from_boolean_oath(valid, token, HttpError.Unauthorized("Invalid token")))

type GetUserByIdFn = (userService: UserService, id: UUIDv4) => () => Oath<User.User, HttpError>
const getUserById0: GetUserByIdFn = (userService, id) => () =>
	userService.getById(id).pipe(rejected_map_oath(toUserNotFoundError))

type GetUserByCookiesFn = (
	us: UserService,
	ts: TTokenService,
) => (ctx: Pick<TCtx, "cookieJti" | "cookieSub">) => Oath<TCtx, HttpError>
const getUserByCookies0: GetUserByCookiesFn =
	(userService, tokenService) =>
	({ cookieSub: cookieSub, cookieJti: cookieJti }) =>
		tokenService.persistenceStrategy
			.getToken(cookieSub, cookieJti)
			.pipe(rejected_map_oath(toUserNotFoundError))
			.and(checkTokenExists0)
			.and(verifyRefreshToken0(tokenService))
			.and(getUserById0(userService, cookieSub))
			.and(user => ({ cookieSub, cookieJti, user }))

type UpdateUserSessionFn = (
	ctx: Context,
	ts: TTokenService,
) => (ctx: TCtx) => Oath<TResult, HttpError>
const updateUserSession0: UpdateUserSessionFn =
	(ctx, tokenService) =>
	({ user, cookieJti: cookieJti, cookieSub: cookieSub }) =>
		tokenService
			.createPair({
				sub: cookieSub,
				prevJti: cookieJti,
				data: {
					fms: user.max_upload_size,
					lim: user.file_limit,
					sbs: user.subscription,
				},
			})
			.pipe(rejected_map_oath(HttpError.from))
			.and(tokens =>
				of_oath(new Date(Date.now() + tokens.exp))
					.pipe(
						tap_oath(expires => setOrdoAuthCookies(ctx.response, expires, tokens.jti, tokens.sub)),
					)
					.and(expires => ({
						accessToken: tokens.tokens.access,
						fileLimit: tokens.lim,
						subscription: tokens.sbs,
						maxUploadSize: tokens.fms,
						sub: tokens.sub,
						jti: tokens.jti,
						expires,
					})),
			)

type DropCookiesFn = (ctx: Context) => () => void
const dropCookies: DropCookiesFn = ctx => () => {
	ctx.cookies.set("jti", null)
	ctx.cookies.set("sub", null)
}
