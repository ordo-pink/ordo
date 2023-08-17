// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Context, Middleware } from "koa"
import type { AccessTokenParsed, TTokenService } from "@ordo-pink/backend-token-service"
import type { UserService } from "@ordo-pink/backend-user-service"
import type { User } from "@ordo-pink/backend-user-service"

import validator from "validator"
import { HttpError, useBearerAuthorization, useBody } from "@ordo-pink/backend-utils"
import { ResponseError } from "@ordo-pink/backend-utils"
import { Oath } from "@ordo-pink/oath"

// --- Public ---

type Body = { email?: string }
type Params = { tokenService: TTokenService; userService: UserService }
type Fn = (params: Params) => Middleware

export const handleChangeEmail: Fn =
	({ tokenService, userService }) =>
	ctx =>
		Oath.all({
			token: useBearerAuthorization(ctx, tokenService),
			body: useBody<Body>(ctx),
		})
			.chain(validateInput(userService))
			.chain(updateUser(userService))
			.fork(ResponseError.send(ctx), sendUser(ctx))

// --- Internal ---

// Validate input from Bearer token and body ------------------------------------------------------

type Input = { token: AccessTokenParsed; body: Body }
type ValidatedInput = { user: User; email: string }
type ValidateInputFn = (service: UserService) => (input: Input) => Oath<ValidatedInput, HttpError>

const validateInput: ValidateInputFn =
	userService =>
	({ token, body }) =>
		Oath.all({
			user: userService.getById(token.payload.sub),
			email: body.email,
		})
			.rejectedMap(ResponseError.create(404, "User not found"))
			.chain(({ user, email }) =>
				Oath.fromNullable(email)
					.chain(validateEmail({ user, userService }))
					.map(() => ({ user, email: email! })),
			)
			.rejectedMap(ResponseError.create(400, "Invalid email"))

// Update user content ----------------------------------------------------------------------------

type UpdateUserFn = (service: UserService) => (input: ValidatedInput) => Oath<User, null>

const updateUser: UpdateUserFn =
	userService =>
	({ user, email }) =>
		userService
			.update(user.id, { email })
			.rejectedMap(console.error)
			.rejectedMap(() => null)

// Send updated user in response ------------------------------------------------------------------

type SendUserFn = (ctx: Context) => (user: User) => void

const sendUser: SendUserFn = ctx => user => {
	ctx.response.body = {
		success: true,
		result: user,
	}
}

type ValidateEmailFnParams = { user: User; userService: UserService }
type ValidateEmailFn = (params: ValidateEmailFnParams) => (email: string) => Oath<"OK", HttpError>

const validateEmail: ValidateEmailFn =
	({ user, userService }) =>
	email =>
		Oath.all(
			[
				validateEmailIsCorrect,
				validateEmailIsNotCurrentUserEmail({ user, userService }),
				validateEmailIsNotTaken({ user, userService }),
			].map(f => f(email)),
		).map(() => "OK")

const validateEmailIsCorrect: ReturnType<ValidateEmailFn> = email =>
	Oath.fromBoolean(
		() => validator.isEmail(email, {}),
		() => "OK" as const,
		() => false,
	).rejectedMap(ResponseError.create(400, "Invalid email"))

const validateEmailIsNotCurrentUserEmail: ValidateEmailFn =
	({ user }) =>
	email =>
		Oath.fromBoolean(
			() => user.email !== email,
			() => "OK" as const,
			() => false,
		).rejectedMap(ResponseError.create(400, "This is your current email"))

const validateEmailIsNotTaken: ValidateEmailFn =
	({ userService }) =>
	email =>
		userService
			.getByEmail(email)
			.chain(() => Oath.reject())
			// TODO: Rewrite with userService.checkUserByEmail
			.fix(userExists =>
				Oath.fromBoolean(
					() => !userExists,
					() => "OK" as const,
					() => false,
				),
			)
			.rejectedMap(ResponseError.create(409, "Email already taken"))
