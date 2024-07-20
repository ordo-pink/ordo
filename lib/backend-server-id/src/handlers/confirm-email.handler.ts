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
	bimap_oath,
	chain_oath,
	from_boolean_oath,
	from_nullable_oath,
	map_oath,
	merge_oath,
	rejected_map_oath,
} from "@ordo-pink/oath"
import { is_string, omit } from "@ordo-pink/tau"
import { parse_body0, send_error, send_success } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"
import { OK } from "@ordo-pink/core"
import { UserService } from "@ordo-pink/backend-service-user"

import {
	to_email_already_confirmed_error,
	to_invalid_body_error,
	to_user_not_found_error,
} from "../fns/to-error"

export const handleConfirmEmail: TFn =
	({ userService }) =>
	ctx =>
		parse_body0<TRequestBody>(ctx, "object")
			.and(validateBody0)
			.and(extractCtx0(userService))
			.and(validateCtx0)
			.and(updateUser0(userService))
			.fork(send_error(ctx), send_success({ ctx }))

// --- Internal ---

type TRequestBody = Routes.ID.ConfirmEmail.RequestBody
type TParams = { userService: UserService }
type TFn = (params: TParams) => Middleware
type TCtx = { user: User.InternalUser; code: string }
type TResult = Routes.ID.ConfirmEmail.ResponseBody

type TValidateBodyFn = (body: TRequestBody) => Oath<Required<TRequestBody>, HttpError>
const validateBody0: TValidateBodyFn = body =>
	merge_oath({
		email: from_nullable_oath(body.email)
			.pipe(chain_oath(email => from_boolean_oath(isEmail(email), body.email!)))
			.pipe(rejected_map_oath(to_invalid_body_error)),
		code: from_boolean_oath(is_string(body.code), body.code!).pipe(
			rejected_map_oath(to_invalid_body_error),
		),
	})

type TExtractCtxFn = (us: UserService) => (body: TRequestBody) => Oath<TCtx, HttpError>
const extractCtx0: TExtractCtxFn = userService => body =>
	merge_oath({
		code: from_nullable_oath(body.code).pipe(rejected_map_oath(to_invalid_body_error)),
		user: from_nullable_oath(body.email)
			.pipe(rejected_map_oath(to_invalid_body_error))
			.pipe(
				chain_oath(email =>
					userService.getByEmail(email).pipe(rejected_map_oath(to_user_not_found_error)),
				),
			),
	})

type TCheckEmailIsNotConfirmedFn = (user: User.InternalUser) => Oath<"OK", HttpError>
const checkEmailIsNotConfirmed0: TCheckEmailIsNotConfirmedFn = user =>
	from_boolean_oath(user.email_confirmed, OK).pipe(
		rejected_map_oath(to_email_already_confirmed_error),
	)

type TCheckCodeIsCorrectFn = (user: User.InternalUser, code: string) => Oath<"OK", HttpError>
const checkCodeIsCorrect0: TCheckCodeIsCorrectFn = (user, code) =>
	from_boolean_oath(user.email_code === code, OK).pipe(rejected_map_oath(to_user_not_found_error))

type TValidateCtxFn = (ctx: TCtx) => Oath<TCtx, HttpError>
const validateCtx0: TValidateCtxFn = ctx =>
	merge_oath([checkEmailIsNotConfirmed0(ctx.user), checkCodeIsCorrect0(ctx.user, ctx.code)]).pipe(
		map_oath(() => ctx),
	)

type TUpdateUser0 = (us: UserService) => (ctx: TCtx) => Oath<TResult, HttpError>
const updateUser0: TUpdateUser0 = userService => ctx =>
	userService
		.update(ctx.user.id, { email_confirmed: true, email_code: undefined })
		.pipe(bimap_oath(to_user_not_found_error, omit("code")))
