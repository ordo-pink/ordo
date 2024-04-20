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
	bimap0,
	chain0,
	empty0,
	fromBoolean0,
	fromNullable0,
	merge0,
	reject0,
	rejectedMap0,
	tap0,
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
	merge0({
		user: fromNullable0(body.userID)
			.pipe(rejectedMap0(toInvalidRequestError))
			.pipe(chain0(id => userService.getById(id).pipe(rejectedMap0(toUserNotFoundError)))),
		oldEmail: fromNullable0(body.oldEmail).pipe(rejectedMap0(toInvalidRequestError)),
		newEmail: fromNullable0(body.newEmail).pipe(rejectedMap0(toInvalidRequestError)),
	})

type TCheckEmailIsNotTheSameFn = (email: string, user: User.PublicUser) => Oath<"OK", HttpError>
const checkEmailIsNotTheSame0: TCheckEmailIsNotTheSameFn = (email, user) =>
	fromBoolean0(user.email !== email, OK).pipe(rejectedMap0(toSameEmailError))

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
		.pipe(chain0(() => reject0(true)))
		.fix(userExists => fromBoolean0(userExists === true, OK))
		.pipe(rejectedMap0(toUserAlreadyExistsError))

type ValidateEmailFn = (email: string) => Oath<"OK", HttpError>
const validateEmail0: ValidateEmailFn = email =>
	fromBoolean0(isEmail(email), OK).pipe(rejectedMap0(toInvalidRequestError))

type ValidateCtxFn = (us: UserService) => (ctx: TCtx) => Oath<TCtx, HttpError>
const validateCtx0: ValidateCtxFn = userService => ctx =>
	merge0([
		validateEmail0(ctx.newEmail),
		checkEmailIsNotTheSame0(ctx.newEmail, ctx.user),
		checkUserWithNewEmailDoesNotExist0(ctx.newEmail, userService),
	]).and(() => ctx)

type UpdateUserEmailFn = (us: UserService) => (ctx: TCtx) => Oath<TCtx, HttpError>
const updateUserEmail0: UpdateUserEmailFn = userService => ctx =>
	userService
		.update(ctx.user.id, { email: ctx.newEmail, emailConfirmed: true, code: undefined })
		.pipe(bimap0(toUserNotFoundError, () => ctx))

type SendNotificationFn = (ns: TNotificationService) => (ctx: TCtx) => Oath<TResult, HttpError>
const sendNotification0: SendNotificationFn = notificationService => ctx =>
	empty0()
		.pipe(
			tap0(() =>
				notificationService.sendEmailChangedNotification({
					to: { email: ctx.user.email, name: ctx.user.firstName }, // TODO: Drop accepting "to" in the service
					newEmail: ctx.newEmail,
					oldEmail: ctx.oldEmail,
				}),
			),
		)
		.and(() => ctx.user)
		.and(omit("code"))
