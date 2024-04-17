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

import { type JWAT, type TTokenService } from "@ordo-pink/backend-service-token"
import { authenticate0, parseBody0 } from "@ordo-pink/backend-utils"
import {
	bimap0,
	chain0,
	fromBoolean0,
	fromNullable0,
	merge0,
	reject0,
	rejectedMap0,
	tap0,
} from "@ordo-pink/oath"
import { sendError, sendSuccess } from "@ordo-pink/backend-utils"
import { OK } from "@ordo-pink/core"
import { type TNotificationService } from "@ordo-pink/backend-service-offline-notifications"
import { type UserService } from "@ordo-pink/backend-service-user"

import {
	toInvalidRequestError,
	toSameEmailError,
	toUserAlreadyExistsError,
	toUserNotFoundError,
} from "../fns/to-error"
import { generateEmailCode0 } from "../fns/generate-code"

export const handleRequestEmailChange: Fn =
	({ tokenService, userService, notificationService, websiteHost }) =>
	ctx =>
		merge0({
			token: authenticate0(ctx, tokenService),
			body: parseBody0<TRequestBody>(ctx),
			code: generateEmailCode0(),
		})
			.and(extractCtx0(userService))
			.and(validateCtx0(userService))
			.and(updateUserEmailConfirmationCode0(userService))
			.pipe(tap0(sendNotification(notificationService, websiteHost)))
			.fork(sendError(ctx), sendSuccess({ ctx }))

// --- Internal ---

type TRequestBody = Routes.ID.Req
type Params = {
	tokenService: TTokenService
	userService: UserService
	notificationService: TNotificationService
	websiteHost: string
}
type Fn = (params: Params) => Middleware
type Ctx = { user: User.User; email: string; code: string }

type ExtractDataParams = { token: JWAT; body: TRequestBody; code: string }
const extractCtx0 =
	(userService: UserService) =>
	({ token, body, code }: ExtractDataParams) =>
		merge0({
			user: userService.getById(token.payload.sub).pipe(rejectedMap0(toUserNotFoundError)),
			email: fromNullable0(body.email).pipe(rejectedMap0(toInvalidRequestError)),
			code,
		})

const checkEmailIsNotTheSame0 = (email: string, user: User.PublicUser) =>
	fromBoolean0(user.email !== email, OK).pipe(rejectedMap0(toSameEmailError))

const checkUserDoesNotExistByNewEmail0 = (email: string, userService: UserService) =>
	userService
		.getByEmail(email)
		.pipe(chain0(() => reject0(true)))
		.fix(userExists => fromBoolean0(userExists === true, OK))
		.pipe(rejectedMap0(toUserAlreadyExistsError))

const validateEmail0 = (email: string) =>
	fromBoolean0(isEmail(email), OK).pipe(rejectedMap0(toInvalidRequestError))

const validateCtx0 =
	(userService: UserService) =>
	({ user, email, code }: Ctx) =>
		merge0([
			validateEmail0(email),
			checkEmailIsNotTheSame0(email, user),
			checkUserDoesNotExistByNewEmail0(email, userService),
		]).and(() => ({ user, email, code }))

const updateUserEmailConfirmationCode0 =
	(userService: UserService) =>
	({ user, email, code }: Ctx) =>
		userService
			.update(user.id, { code })
			.pipe(bimap0(toUserNotFoundError, () => ({ user, email, code })))

const sendNotification =
	(notificationService: TNotificationService, websiteHost: string) =>
	({ user, email, code }: Ctx) =>
		notificationService.sendEmailChangeNotifications({
			to: { email: user.email, name: user.firstName },
			newEmail: email,
			oldEmail: user.email,
			confirmationUrl: `${websiteHost}/change-email?oldEmail=${user.email}&newEmail=${email}&code=${code}`, // TODO
		})
