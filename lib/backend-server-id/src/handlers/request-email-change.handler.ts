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
import {
	type Oath,
	bimap_oath,
	chain_oath,
	from_boolean_oath,
	from_nullable_oath,
	merge_oath,
	reject_oath,
	rejected_map_oath,
	tap_oath,
} from "@ordo-pink/oath"
import { authenticate0, parseBody0 } from "@ordo-pink/backend-utils"
import { sendError, sendSuccess } from "@ordo-pink/backend-utils"
import { type HttpError } from "@ordo-pink/rrr"
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

export const handleRequestEmailChange: TFn =
	({ tokenService, userService, notificationService, websiteHost }) =>
	ctx =>
		merge_oath({
			token: authenticate0(ctx, tokenService),
			body: parseBody0<TRequestBody>(ctx),
			code: generateEmailCode0(),
		})
			.and(extractCtx0(userService))
			.and(validateCtx0(userService))
			.and(updateUserEmailConfirmationCode0(userService))
			.pipe(tap_oath(sendNotification(notificationService, websiteHost)))
			.fork(sendError(ctx), sendSuccess({ ctx }))

// --- Internal ---

type TRequestBody = Routes.ID.RequestEmailChange.RequestBody
type TParams = {
	tokenService: TTokenService
	userService: UserService
	notificationService: TNotificationService
	websiteHost: string
}
type TFn = (params: TParams) => Middleware
type TCtx = { user: User.User; newEmail: string; code: string }

type TExtractDataParams = { token: JWAT; body: TRequestBody; code: string }
const extractCtx0 =
	(userService: UserService) =>
	({ token, body, code }: TExtractDataParams) =>
		merge_oath({
			user: userService.getById(token.payload.sub).pipe(rejected_map_oath(toUserNotFoundError)),
			newEmail: from_nullable_oath(body.newEmail).pipe(rejected_map_oath(toInvalidRequestError)),
			code,
		})

type TCheckEmailIsNotTheSameFn = (email: string, user: User.User) => Oath<"OK", HttpError>
const checkEmailIsNotTheSame0: TCheckEmailIsNotTheSameFn = (email, user) =>
	from_boolean_oath(user.email !== email, OK).pipe(rejected_map_oath(toSameEmailError))

const checkUserDoesNotExistByNewEmail0 = (email: string, userService: UserService) =>
	userService
		.getByEmail(email)
		.pipe(chain_oath(() => reject_oath(true)))
		.fix(userExists => from_boolean_oath(userExists === true, OK))
		.pipe(rejected_map_oath(toUserAlreadyExistsError))

const validateEmail0 = (email: string) =>
	from_boolean_oath(isEmail(email), OK).pipe(rejected_map_oath(toInvalidRequestError))

const validateCtx0 =
	(userService: UserService) =>
	({ user, newEmail, code }: TCtx) =>
		merge_oath([
			validateEmail0(newEmail),
			checkEmailIsNotTheSame0(newEmail, user),
			checkUserDoesNotExistByNewEmail0(newEmail, userService),
		]).and(() => ({ user, newEmail, code }))

const updateUserEmailConfirmationCode0 =
	(userService: UserService) =>
	({ user, newEmail, code }: TCtx) =>
		userService
			.update(user.id, { code })
			.pipe(bimap_oath(toUserNotFoundError, () => ({ user, newEmail, code })))

const sendNotification =
	(notificationService: TNotificationService, websiteHost: string) =>
	({ user, newEmail: newEmail, code }: TCtx) =>
		notificationService.sendEmailChangeNotifications({
			to: { email: user.email, name: user.firstName },
			newEmail,
			oldEmail: user.email,
			confirmationUrl: `${websiteHost}/change-email?oldEmail=${user.email}&newEmail=${newEmail}&code=${code}`, // TODO
		})
