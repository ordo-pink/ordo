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

import { type Middleware } from "koa"

import { type JWAT, type TTokenService } from "@ordo-pink/backend-service-token"
import {
	type Oath,
	bimap_oath,
	from_boolean_oath,
	from_nullable_oath,
	merge_oath,
	rejected_map_oath,
} from "@ordo-pink/oath"
import { authenticate0, parseBody0, sendError, sendSuccess } from "@ordo-pink/backend-utils"
import { is_string, omit } from "@ordo-pink/tau"
import { type HttpError } from "@ordo-pink/rrr"
import { type UserService } from "@ordo-pink/backend-service-user"

import { toInvalidBodyError, toUserNotFoundError } from "../fns/to-error"

export const handleChangeAccountInfo: TFn =
	({ tokenService, userService }) =>
	ctx =>
		merge_oath({
			body: parseBody0<TRequestBody>(ctx),
			token: authenticate0(ctx, tokenService),
		})
			.and(extractCtx0(userService))
			.and(validateCtx0)
			.and(updateUserInfo0(userService))
			.fork(sendError(ctx), sendSuccess({ ctx }))

// --- Internal ---

type TParams = { tokenService: TTokenService; userService: UserService }
type TFn = (params: TParams) => Middleware
type TRequestBody = Routes.ID.ChangeAccountInfo.RequestBody
type TRequest = { token: JWAT; body: TRequestBody }
type TCtx = { user: User.User; firstName: string; lastName: string }
type TResult = Routes.ID.ChangeAccountInfo.Result

type TExtractCtxFn = (us: UserService) => (p: TRequest) => Oath<TCtx, HttpError>
const extractCtx0: TExtractCtxFn =
	userService =>
	({ body: { firstName, lastName }, token }) =>
		merge_oath({
			user: userService.getById(token.payload.sub).pipe(rejected_map_oath(toUserNotFoundError)),
			firstName: from_nullable_oath(firstName).pipe(rejected_map_oath(toInvalidBodyError)),
			lastName: from_nullable_oath(lastName).pipe(rejected_map_oath(toInvalidBodyError)),
		})

type TValidateCtxFn = (ctx: TCtx) => Oath<TCtx, HttpError>
const validateCtx0: TValidateCtxFn = ctx =>
	from_boolean_oath(is_string(ctx.firstName) && is_string(ctx.lastName), ctx).pipe(
		rejected_map_oath(toInvalidBodyError),
	)

type TUpdateUserInfoFn = (us: UserService) => (ctx: TCtx) => Oath<TResult, HttpError>
const updateUserInfo0: TUpdateUserInfoFn =
	userService =>
	({ firstName, lastName, user }) =>
		userService
			.update(user.id, { first_name: firstName, last_name: lastName })
			.pipe(bimap_oath(toUserNotFoundError, omit("code")))
