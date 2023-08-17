// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Context, Middleware } from "koa"
import type { PublicUser, UserService } from "@ordo-pink/backend-user-service"
import type { TTokenService } from "@ordo-pink/backend-token-service"
import { ResponseError, HttpError, useBearerAuthorization } from "@ordo-pink/backend-utils"
import { Oath } from "@ordo-pink/oath"

// --- Public ---

export type Params = { tokenService: TTokenService; userService: UserService }
export type Fn = (params: Params) => Middleware

export const handleUserInfo: Fn =
	({ tokenService, userService }) =>
	ctx =>
		Oath.from(() => useBearerAuthorization(ctx, tokenService))
			.map(() => ctx.params.email)
			.chain(getPublicUserByEmail(userService))
			.fork(ResponseError.send(ctx), sendUserInfo(ctx))

// --- Internal ---

// Get user entity by id --------------------------------------------------------------------------

type GetUserByEmailFn = (service: UserService) => (email: string) => Oath<PublicUser, HttpError>

const getPublicUserByEmail: GetUserByEmailFn = userService => email =>
	userService.getUserInfo(email).rejectedMap(ResponseError.create(404, "User not found"))

// Send account info in response ------------------------------------------------------------------

type SendUserInfoFn = (ctx: Context) => (user: PublicUser) => void

const sendUserInfo: SendUserInfoFn = ctx => user => {
	ctx.response.body = {
		success: true,
		result: user,
	}
}
