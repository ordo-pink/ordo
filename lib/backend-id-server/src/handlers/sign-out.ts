// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { TTokenService, TokenRecord } from "#lib/backend-token-service/mod.ts"
import type { Middleware } from "#x/oak@v12.6.0/middleware.ts"
import type { UserService } from "#lib/backend-user-service/mod.ts"

import { useBearerAuthorization } from "#lib/backend-utils/mod.ts"

type Params = { userService: UserService; tokenService: TTokenService }
type Fn = (params: Params) => Middleware

export const handleSignOut: Fn =
	({ tokenService }) =>
	async ctx => {
		const { payload } = await useBearerAuthorization(ctx, tokenService)
		const { sub, jti } = payload

		const tokenMap = await tokenService
			.getPersistedTokens(sub)
			.fix(() => ({}) as TokenRecord)
			.toPromise()

		if (!tokenMap || !tokenMap[jti]) {
			return ctx.throw(403, "Invalid or outdated token")
		}

		await tokenService.removePersistedToken(sub, jti).toPromise()

		await ctx.cookies.delete("jti")
		await ctx.cookies.delete("sub")

		ctx.response.status = 204
	}
