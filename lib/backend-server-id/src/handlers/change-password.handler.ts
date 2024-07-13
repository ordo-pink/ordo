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

import { type Middleware, type Response } from "koa"

import { type JWAT, type TTokenService } from "@ordo-pink/backend-service-token"
import {
	type Oath,
	bimap_oath,
	from_nullable_oath,
	merge_oath,
	of_oath,
	rejected_map_oath,
	swap_oath,
	tap_oath,
} from "@ordo-pink/oath"
import { authenticate0, parseBody0, sendError, sendSuccess } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"
import { OK } from "@ordo-pink/core"
import { type UserService } from "@ordo-pink/backend-service-user"
import { okpwd } from "@ordo-pink/okpwd"

import { toInvalidBodyError, toUserNotFoundError } from "../fns/to-error"
import { setOrdoAuthCookies } from "../fns/set-cookies"

export const handleChangePassword: TFn =
	({ tokenService, userService }) =>
	ctx =>
		merge_oath({
			token: authenticate0(ctx, tokenService),
			body: parseBody0<TRequestBody>(ctx, "object"),
		})
			.and(extractCtx0(userService))
			.and(validateCtx0)
			.and(updateUserPassword0(userService))
			.and(dropActiveUserSessions0(tokenService))
			.and(createUserSession0(tokenService, ctx.response))
			.fork(sendError(ctx), sendSuccess({ ctx }))

// --- Internal ---

type TParams = { tokenService: TTokenService; userService: UserService }
type TFn = (params: TParams) => Middleware
type TRequestBody = Routes.ID.ChangePassword.RequestBody
type TRequest = { token: JWAT; body: TRequestBody }
type TCtx = { oldPassword: string; newPassword: string; user: User.User }
type TResult = Routes.ID.ChangePassword.Result

const checkPwd = okpwd()

type TExtractCtxFn = (us: UserService) => (p: TRequest) => Oath<TCtx, HttpError>
const extractCtx0: TExtractCtxFn =
	userService =>
	({ token, body: { oldPassword, newPassword } }) =>
		merge_oath({
			user: userService.getById(token.payload.sub).pipe(rejected_map_oath(toUserNotFoundError)),
			oldPassword: from_nullable_oath(oldPassword).pipe(rejected_map_oath(toInvalidBodyError)),
			newPassword: from_nullable_oath(newPassword).pipe(rejected_map_oath(toInvalidBodyError)),
		})

type TCheckNewPasswordIsValidFn = (body: TRequestBody) => Oath<"OK", HttpError>
const checkNewPasswordIsValid0: TCheckNewPasswordIsValidFn = body =>
	from_nullable_oath(checkPwd(body.newPassword))
		.pipe(swap_oath)
		.and(() => OK)
		.pipe(rejected_map_oath(pwdErr => HttpError.BadRequest(pwdErr)))

type TValidateCtxFn = (ctx: TCtx) => Oath<TCtx, HttpError>
const validateCtx0: TValidateCtxFn = ctx => checkNewPasswordIsValid0(ctx).and(() => ctx)

type TUpdateUserPasswordFn = (us: UserService) => (ctx: TCtx) => Oath<TCtx, HttpError>
const updateUserPassword0: TUpdateUserPasswordFn = userService => ctx =>
	userService.updateUserPassword(ctx.user, ctx.oldPassword, ctx.newPassword).pipe(
		bimap_oath(
			error =>
				error && error instanceof Error
					? HttpError.from(error)
					: HttpError.NotFound(error ?? "User not found"),
			() => ctx,
		),
	)

type TDropActiveUserSessionsFn = (ts: TTokenService) => (ctx: TCtx) => Oath<TCtx, HttpError>
const dropActiveUserSessions0: TDropActiveUserSessionsFn = tokenService => ctx =>
	tokenService.persistenceStrategy
		.removeTokenRecord(ctx.user.id)
		.pipe(bimap_oath(HttpError.from, () => ctx))

type TCreateUserSessionFn = (
	ts: TTokenService,
	r: Response,
) => (ctx: TCtx) => Oath<TResult, HttpError>
const createUserSession0: TCreateUserSessionFn = (tokenService, response) => ctx =>
	tokenService
		.createPair({ sub: ctx.user.id })
		.pipe(rejected_map_oath(HttpError.from))
		.and(tokens =>
			of_oath(new Date(Date.now() + tokens.exp))
				.pipe(tap_oath(expires => setOrdoAuthCookies(response, expires, tokens.jti, tokens.sub)))
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
