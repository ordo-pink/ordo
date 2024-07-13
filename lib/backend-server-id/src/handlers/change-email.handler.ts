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
	type Oath,
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
import { parseBody0, sendError, sendSuccess } from "@ordo-pink/backend-utils"
import { type HttpError } from "@ordo-pink/rrr"
import { OK } from "@ordo-pink/core"
import { type TNotificationService } from "@ordo-pink/backend-service-offline-notifications"
import { type TTokenService } from "@ordo-pink/backend-service-token"
import { type UserService } from "@ordo-pink/backend-service-user"
import { omit } from "@ordo-pink/tau"

import {
	toInvalidRequestError,
	toSameEmailError,
	toUserAlreadyExistsError,
	toUserNotFoundError,
} from "../fns/to-error"

export const handleChangeEmail: TFn =
	({ userService, notificationService }) =>
	ctx =>
		parseBody0<TRequestBody>(ctx)
			.and(extractCtx0(userService))
			.and(validateCtx0(userService))
			.and(updateUserEmail0(userService))
			.and(sendNotification0(notificationService))
			.fork(sendError(ctx), sendSuccess({ ctx }))

// --- Internal ---

type TParams = {
	tokenService: TTokenService
	userService: UserService
	notificationService: TNotificationService
}
type TFn = (params: TParams) => Middleware
type TRequestBody = Routes.ID.ChangeEmail.RequestBody
type TCtx = { user: User.PrivateUser; oldEmail: string; newEmail: string }
type TResult = Routes.ID.ChangeEmail.Result

type TExtractCtxFn = (us: UserService) => (body: TRequestBody) => Oath<TCtx, HttpError>
const extractCtx0: TExtractCtxFn = userService => body =>
	merge_oath({
		user: from_nullable_oath(body.userID)
			.pipe(rejected_map_oath(toInvalidRequestError))
			.pipe(chain_oath(id => userService.getById(id).pipe(rejected_map_oath(toUserNotFoundError)))),
		oldEmail: from_nullable_oath(body.oldEmail).pipe(rejected_map_oath(toInvalidRequestError)),
		newEmail: from_nullable_oath(body.newEmail).pipe(rejected_map_oath(toInvalidRequestError)),
	})

type TCheckEmailIsNotTheSameFn = (email: string, user: User.PublicUser) => Oath<"OK", HttpError>
const checkEmailIsNotTheSame0: TCheckEmailIsNotTheSameFn = (email, user) =>
	from_boolean_oath(user.email !== email, OK).pipe(rejected_map_oath(toSameEmailError))

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
		.pipe(rejected_map_oath(toUserAlreadyExistsError))

type ValidateEmailFn = (email: string) => Oath<"OK", HttpError>
const validateEmail0: ValidateEmailFn = email =>
	from_boolean_oath(isEmail(email), OK).pipe(rejected_map_oath(toInvalidRequestError))

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
		.update(ctx.user.id, { email: ctx.newEmail, emailConfirmed: true, code: undefined })
		.pipe(bimap_oath(toUserNotFoundError, () => ctx))

type SendNotificationFn = (ns: TNotificationService) => (ctx: TCtx) => Oath<TResult, HttpError>
const sendNotification0: SendNotificationFn = notificationService => ctx =>
	empty_oath()
		.pipe(
			tap_oath(() =>
				notificationService.sendEmailChangedNotification({
					to: { email: ctx.user.email, name: ctx.user.firstName }, // TODO: Drop accepting "to" in the service
					newEmail: ctx.newEmail,
					oldEmail: ctx.oldEmail,
				}),
			),
		)
		.and(() => ctx.user)
		.and(omit("code"))
