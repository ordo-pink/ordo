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

import { TTokenService } from "@ordo-pink/backend-service-token"
import { UserService } from "@ordo-pink/backend-service-user"
import { sendError, authenticate0, parseBody0 } from "@ordo-pink/backend-utils"
import { Oath } from "@ordo-pink/oath"
import { HttpError } from "@ordo-pink/rrr"
import { isString } from "@ordo-pink/tau"
import { Middleware } from "koa"

type Body = Pick<User.PublicUser, "firstName" | "lastName">
type Params = { tokenService: TTokenService; userService: UserService }
type Fn = (params: Params) => Middleware

export const handleChangeAccountInfo: Fn =
	({ tokenService, userService }) =>
	ctx =>
		Oath.all({
			body: parseBody0<Body>(ctx).chain(({ firstName, lastName }) =>
				Oath.fromBoolean(
					() => isString(firstName) || isString(lastName),
					() => ({ firstName, lastName }),
					() => HttpError.BadRequest("Invalid body"),
				),
			),
			authorization: authenticate0(ctx, tokenService),
		})
			.chain(({ body, authorization }) =>
				userService
					.getById(authorization.payload.sub)
					.rejectedMap(() => HttpError.NotFound("User not found"))
					.chain(user =>
						userService
							.update(user.id, { firstName: body.firstName, lastName: body.lastName })
							.rejectedMap(() => HttpError.NotFound("User not found")),
					),
			)
			.fork(sendError(ctx), result => {
				ctx.response.body = { success: true, result }
			})
