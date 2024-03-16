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
import validator from "validator"

import { authenticate0, parseBody0 } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"
import { Oath } from "@ordo-pink/oath"
import { type TTokenService } from "@ordo-pink/backend-service-token"
import { type UserService } from "@ordo-pink/backend-service-user"
import { sendError } from "@ordo-pink/backend-utils"

type Body = { email?: string }
type Params = { tokenService: TTokenService; userService: UserService }
type Fn = (params: Params) => Middleware

export const handleChangeEmail: Fn =
	({ tokenService, userService }) =>
	ctx =>
		Oath.all({
			token: authenticate0(ctx, tokenService),
			body: parseBody0<Body>(ctx),
		})
			.chain(({ token, body }) =>
				Oath.all({
					user: userService.getById(token.payload.sub),
					email: Oath.fromNullable(body.email).rejectedMap(() =>
						HttpError.BadRequest("Email not provided"),
					),
				})
					.rejectedMap(() => HttpError.NotFound("User not found"))
					.chain(({ user, email }) =>
						Oath.all([
							Oath.fromBoolean(
								() => validator.isEmail(email),
								() => "OK" as const,
								() => false,
							).rejectedMap(() => HttpError.BadRequest("Invalid email")),
							Oath.fromBoolean(
								() => user.email !== email,
								() => "OK" as const,
								() => false,
							).rejectedMap(() => HttpError.BadRequest("This is your current email")),
							userService
								.getByEmail(email)
								.chain(() => Oath.reject(true))
								.fix(userExists =>
									Oath.fromBoolean(
										() => !userExists,
										() => "OK" as const,
										() => false,
									),
								)
								.rejectedMap(() => HttpError.Conflict("Email already taken")),
						]).map(() => ({ user, email: email })),
					),
			)
			.chain(({ user, email }) =>
				userService
					.update(user.id, { email })
					.rejectedMap(() => HttpError.NotFound("User not found")),
			)
			.fork(sendError(ctx), result => {
				ctx.response.body = { success: true, result }
			})
