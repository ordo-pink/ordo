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

import { JTI, SUB } from "@ordo-pink/wjwt"
import { Oath } from "@ordo-pink/oath"
import type { TTokenService } from "@ordo-pink/backend-service-token"
import type { UserService } from "@ordo-pink/backend-service-user"
import { sendError } from "@ordo-pink/backend-utils"

type Params = { userService: UserService; tokenService: TTokenService }
type Fn = (params: Params) => Middleware

export const handleSignOut: Fn =
	({ tokenService }) =>
	async ctx =>
		Oath.all({
			sub: Oath.fromNullable(ctx.cookies.get("sub") as SUB),
			jti: Oath.fromNullable(ctx.cookies.get("jti") as JTI),
		})
			.chain(({ sub, jti }) => tokenService.persistenceStrategy.removeToken(sub, jti))
			.fix(() => "OK")
			.tap(() => {
				ctx.response.set("Set-Cookie", "jti=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;")
				ctx.response.set("Set-Cookie", "sub=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;")
			})
			.fork(sendError(ctx), () => {
				ctx.response.status = 204
			})
