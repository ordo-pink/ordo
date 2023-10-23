// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { TTokenService } from "@ordo-pink/backend-service-token"
import type { Middleware } from "koa"
import type { UserService } from "@ordo-pink/backend-service-user"
import { sendError } from "@ordo-pink/backend-utils"
import { Oath } from "@ordo-pink/oath"
import { JTI, SUB } from "@ordo-pink/wjwt"

type Params = { userService: UserService; tokenService: TTokenService }
type Fn = (params: Params) => Middleware

export const handleSignOut: Fn =
	({ tokenService }) =>
	async ctx =>
		Oath.all({
			sub: Oath.fromNullable(ctx.cookies.get("sub") as SUB),
			jti: Oath.fromNullable(ctx.cookies.get("jti") as JTI),
		})
			.chain(({ sub, jti }) => tokenService.repository.removeToken(sub, jti))
			.fix(() => "OK")
			.tap(expires => {
				ctx.response.set("Set-Cookie", `jti=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`)
				ctx.response.set("Set-Cookie", `sub=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`)
			})
			.fork(sendError(ctx), () => {
				ctx.response.status = 204
			})
