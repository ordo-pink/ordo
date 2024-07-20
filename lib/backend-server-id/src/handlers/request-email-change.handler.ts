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

import { type TAccessJWT, type TTokenService } from "@ordo-pink/backend-service-token"
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
import { authenticate0, parse_body0 } from "@ordo-pink/backend-utils"
import { send_error, send_success } from "@ordo-pink/backend-utils"
import { type HttpError } from "@ordo-pink/rrr"
import { OK } from "@ordo-pink/core"
import { type TNotificationService } from "@ordo-pink/backend-service-offline-notifications"
import { type UserService } from "@ordo-pink/backend-service-user"

import {
	to_invalid_request_error,
	to_same_email_error,
	to_user_already_exists_error,
	to_user_not_found_error,
} from "../fns/to-error"
import { generateEmailCode0 } from "../fns/generate-code"

export const handleRequestEmailChange: TFn =
	({ tokenService, userService, notificationService, websiteHost }) =>
	ctx =>
		merge_oath({
			token: authenticate0(ctx, tokenService),
			body: parse_body0<TRequestBody>(ctx),
			code: generateEmailCode0(),
		})
			.and(extractCtx0(userService))
			.and(validateCtx0(userService))
			.and(updateUserEmailConfirmationCode0(userService))
			.pipe(tap_oath(sendNotification(notificationService, websiteHost)))
			.fork(send_error(ctx), send_success({ ctx }))

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

type TExtractDataParams = { token: TAccessJWT; body: TRequestBody; code: string }
const extractCtx0 =
	(userService: UserService) =>
	({ token, body, code }: TExtractDataParams) =>
		merge_oath({
			user: userService.getById(token.payload.sub).pipe(rejected_map_oath(to_user_not_found_error)),
			newEmail: from_nullable_oath(body.new_email).pipe(
				rejected_map_oath(to_invalid_request_error),
			),
			code,
		})

type TCheckEmailIsNotTheSameFn = (email: string, user: User.User) => Oath<"OK", HttpError>
const checkEmailIsNotTheSame0: TCheckEmailIsNotTheSameFn = (email, user) =>
	from_boolean_oath(user.email !== email, OK).pipe(rejected_map_oath(to_same_email_error))

const checkUserDoesNotExistByNewEmail0 = (email: string, userService: UserService) =>
	userService
		.getByEmail(email)
		.pipe(chain_oath(() => reject_oath(true)))
		.fix(userExists => from_boolean_oath(userExists === true, OK))
		.pipe(rejected_map_oath(to_user_already_exists_error))

const validateEmail0 = (email: string) =>
	from_boolean_oath(isEmail(email), OK).pipe(rejected_map_oath(to_invalid_request_error))

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
			.update(user.id, { email_code: code })
			.pipe(bimap_oath(to_user_not_found_error, () => ({ user, newEmail, code })))

const sendNotification =
	(notificationService: TNotificationService, websiteHost: string) =>
	({ user, newEmail: newEmail, code }: TCtx) =>
		notificationService.change_email({
			to: { email: user.email, name: user.first_name },
			new_email: newEmail,
			old_email: user.email,
			confirmation_url: `${websiteHost}/change-email?oldEmail=${user.email}&newEmail=${newEmail}&code=${code}`, // TODO
		})
