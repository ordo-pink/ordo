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

import type { Middleware } from "koa"
import isEmail from "validator/lib/isEmail"

import {
	Oath,
	bimap0,
	chain0,
	fromBoolean0,
	fromNullable0,
	map0,
	merge0,
	rejectedMap0,
} from "@ordo-pink/oath"
import { isString, omit } from "@ordo-pink/tau"
import { parseBody0, sendError, sendSuccess } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"
import { OK } from "@ordo-pink/core"
import { UserService } from "@ordo-pink/backend-service-user"

import {
	toEmailAlreadyConfirmedError,
	toInvalidBodyError,
	toUserNotFoundError,
} from "../fns/to-error"

export const handleConfirmEmail: TFn =
	({ userService }) =>
	ctx =>
		parseBody0<TRequestBody>(ctx, "object")
			.and(validateBody0)
			.and(extractCtx0(userService))
			.and(validateCtx0)
			.and(updateUser0(userService))
			.fork(sendError(ctx), sendSuccess({ ctx }))

// --- Internal ---

type TRequestBody = Routes.ID.ConfirmEmail.RequestBody
type TParams = { userService: UserService }
type TFn = (params: TParams) => Middleware
type TCtx = { user: User.PrivateUser; code: string }
type TResult = Routes.ID.ConfirmEmail.Result

type TValidateBodyFn = (body: TRequestBody) => Oath<Required<TRequestBody>, HttpError>
const validateBody0: TValidateBodyFn = body =>
	merge0({
		email: fromNullable0(body.email)
			.pipe(chain0(email => fromBoolean0(isEmail(email), body.email!)))
			.pipe(rejectedMap0(toInvalidBodyError)),
		code: fromBoolean0(isString(body.code), body.code!).pipe(rejectedMap0(toInvalidBodyError)),
	})

type TExtractCtxFn = (us: UserService) => (body: TRequestBody) => Oath<TCtx, HttpError>
const extractCtx0: TExtractCtxFn = userService => body =>
	merge0({
		code: fromNullable0(body.code).pipe(rejectedMap0(toInvalidBodyError)),
		user: fromNullable0(body.email)
			.pipe(rejectedMap0(toInvalidBodyError))
			.pipe(chain0(email => userService.getByEmail(email).pipe(rejectedMap0(toUserNotFoundError)))),
	})

type TCheckEmailIsNotConfirmedFn = (user: User.PrivateUser) => Oath<"OK", HttpError>
const checkEmailIsNotConfirmed0: TCheckEmailIsNotConfirmedFn = user =>
	fromBoolean0(user.emailConfirmed, OK).pipe(rejectedMap0(toEmailAlreadyConfirmedError))

type TCheckCodeIsCorrectFn = (user: User.PrivateUser, code: string) => Oath<"OK", HttpError>
const checkCodeIsCorrect0: TCheckCodeIsCorrectFn = (user, code) =>
	fromBoolean0(user.code === code, OK).pipe(rejectedMap0(toUserNotFoundError))

type TValidateCtxFn = (ctx: TCtx) => Oath<TCtx, HttpError>
const validateCtx0: TValidateCtxFn = ctx =>
	merge0([checkEmailIsNotConfirmed0(ctx.user), checkCodeIsCorrect0(ctx.user, ctx.code)]).pipe(
		map0(() => ctx),
	)

type TUpdateUser0 = (us: UserService) => (ctx: TCtx) => Oath<TResult, HttpError>
const updateUser0: TUpdateUser0 = userService => ctx =>
	userService
		.update(ctx.user.id, { emailConfirmed: true, code: undefined })
		.pipe(bimap0(toUserNotFoundError, omit("code")))
