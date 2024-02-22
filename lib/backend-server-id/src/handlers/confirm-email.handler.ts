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
import { sendError, parseBody0 } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"
import { Oath } from "@ordo-pink/oath"
import { UserService } from "@ordo-pink/backend-service-user"

type Body = { email?: string; code?: string }
type Params = { userService: UserService }
type Fn = (params: Params) => Middleware

export const handleConfirmEmail: Fn =
	({ userService }) =>
	ctx =>
		parseBody0<Body>(ctx, "object")
			.chain(({ email, code }) =>
				Oath.all({ email: Oath.fromNullable(email), code: Oath.fromNullable(code) }),
			)
			.chain(({ email, code }) =>
				userService
					.getByEmail(email)
					.rejectedMap(() => HttpError.NotFound("User not found"))
					.chain(
						Oath.ifElse(usr => usr.code === code, {
							onFalse: () => HttpError.NotFound("User not found"),
						}),
					)
					.chain(
						Oath.ifElse(usr => !usr.emailConfirmed, {
							onFalse: () => HttpError.Conflict("Subscription already on"),
						}),
					)
					.chain(usr =>
						userService
							.update(usr.id, { emailConfirmed: true, code: undefined })
							.rejectedMap(() => HttpError.NotFound("User not found")),
					),
			)
			.fork(sendError(ctx), result => {
				ctx.response.body = { success: true, result }
			})
