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
import isEmail from "validator/lib/isEmail"

import {
	Oath,
	bimap_oath,
	chain_oath,
	empty_oath,
	from_boolean_oath,
	from_nullable_oath,
	merge_oath,
	reject_oath,
	rejected_map_oath,
	tap_oath,
} from "@ordo-pink/oath"
import { parse_body0, send_error, send_success } from "@ordo-pink/backend-utils"
import { type HttpError } from "@ordo-pink/rrr"
import { OK } from "@ordo-pink/core"
import { type TNotificationService } from "@ordo-pink/backend-service-offline-notifications"
import { type TTokenService } from "@ordo-pink/backend-service-token"
import { type UserService } from "@ordo-pink/backend-service-user"
import { omit } from "@ordo-pink/tau"

import {
	to_invalid_request_error,
	to_same_email_error,
	to_user_already_exists_error,
	to_user_not_found_error,
} from "../fns/to-error"

export const handleChangeEmail: TFn =
	({ userService, notificationService }) =>
	ctx =>
		parse_body0<TRequestBody>(ctx)
			.pipe(Oath.ops.chain(extractCtx0(userService)))
			.pipe(Oath.ops.chain(validateCtx0(userService)))
			.pipe(Oath.ops.chain(updateUserEmail0(userService)))
			.pipe(Oath.ops.chain(sendNotification0(notificationService)))
			.fork(send_error(ctx), send_success({ ctx }))

// --- Internal ---

type TParams = {
	tokenService: TTokenService
	userService: UserService
	notificationService: TNotificationService
}
type TFn = (params: TParams) => Middleware
type TRequestBody = Routes.ID.UpdateEmail.RequestBody
type TCtx = { user: User.InternalUser; oldEmail: string; newEmail: string }
type TResult = Routes.ID.UpdateEmail.ResponseBody

type TExtractCtxFn = (us: UserService) => (body: TRequestBody) => Oath<TCtx, HttpError>
const extractCtx0: TExtractCtxFn = userService => body =>
	merge_oath({
		user: from_nullable_oath(body.user_id)
			.pipe(rejected_map_oath(to_invalid_request_error))
			.pipe(
				chain_oath(id => userService.getById(id).pipe(rejected_map_oath(to_user_not_found_error))),
			),
		oldEmail: from_nullable_oath(body.old_email).pipe(rejected_map_oath(to_invalid_request_error)),
		newEmail: from_nullable_oath(body.new_email).pipe(rejected_map_oath(to_invalid_request_error)),
	})

type TCheckEmailIsNotTheSameFn = (email: string, user: User.PublicUser) => Oath<"OK", HttpError>
const checkEmailIsNotTheSame0: TCheckEmailIsNotTheSameFn = (email, user) =>
	from_boolean_oath(user.email !== email, OK).pipe(rejected_map_oath(to_same_email_error))

type TCheckUserWithNewEmailDoesNotExistFn = (
	newEmail: string,
	us: UserService,
) => Oath<"OK", HttpError>
const checkUserWithNewEmailDoesNotExist0: TCheckUserWithNewEmailDoesNotExistFn = (
	newEmail,
	userService,
) =>
	userService
		.getByEmail(newEmail)
		.pipe(chain_oath(() => reject_oath(true)))
		.fix(userExists => from_boolean_oath(userExists === true, OK))
		.pipe(rejected_map_oath(to_user_already_exists_error))

type ValidateEmailFn = (email: string) => Oath<"OK", HttpError>
const validateEmail0: ValidateEmailFn = email =>
	from_boolean_oath(isEmail(email), OK).pipe(rejected_map_oath(to_invalid_request_error))

type ValidateCtxFn = (us: UserService) => (ctx: TCtx) => Oath<TCtx, HttpError>
const validateCtx0: ValidateCtxFn = userService => ctx =>
	merge_oath([
		validateEmail0(ctx.newEmail),
		checkEmailIsNotTheSame0(ctx.newEmail, ctx.user),
		checkUserWithNewEmailDoesNotExist0(ctx.newEmail, userService),
	]).and(() => ctx)

type UpdateUserEmailFn = (us: UserService) => (ctx: TCtx) => Oath<TCtx, HttpError>
const updateUserEmail0: UpdateUserEmailFn = userService => ctx =>
	userService
		.update(ctx.user.id, { email: ctx.newEmail, email_confirmed: true, email_code: undefined })
		.pipe(bimap_oath(to_user_not_found_error, () => ctx))

type SendNotificationFn = (ns: TNotificationService) => (ctx: TCtx) => Oath<TResult, HttpError>
const sendNotification0: SendNotificationFn = notificationService => ctx =>
	empty_oath()
		.pipe(
			tap_oath(() =>
				notificationService.email_changed({
					to: { email: ctx.user.email, name: ctx.user.first_name }, // TODO: Drop accepting "to" in the service
					new_email: ctx.newEmail,
					old_email: ctx.oldEmail,
				}),
			),
		)
		.and(() => ctx.user)
		.and(omit("code"))
