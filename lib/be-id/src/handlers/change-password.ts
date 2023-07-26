// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

import type { TokenService } from "#lib/token-service/mod.ts"
import type { UserService } from "#lib/user-service/mod.ts"
import type { Middleware } from "#x/oak@v12.6.0/middleware.ts"

import { okpwd } from "#lib/okpwd/mod.ts"
import { useBearerAuthorization, useBody } from "#lib/be-use/mod.ts"

export type Body = { oldPassword?: string; newPassword?: string }
export type Params = { tokenService: TokenService; userService: UserService }
export type Fn = (params: Params) => Middleware

export const handleChangePassword: Fn =
	({ tokenService, userService }) =>
	async ctx => {
		const { payload } = await useBearerAuthorization(ctx, tokenService)
		const { oldPassword, newPassword } = await useBody<Body>(ctx)
		const validatePassword = okpwd()

		if (!oldPassword) {
			return ctx.throw(400, "Invalid password")
		}

		const newPasswordError = validatePassword(newPassword)

		if (newPasswordError) {
			return ctx.throw(400, newPasswordError)
		}

		if (oldPassword === newPassword) {
			return ctx.throw(400, "Passwords must not match")
		}

		const id = payload.sub
		const user = await userService.getById(id).toPromise()

		if (!user) {
			return ctx.throw(404, "User not found")
		}

		const passwordVerified = await userService.comparePassword(user.email, oldPassword).toPromise()

		if (!passwordVerified) {
			return ctx.throw(404, "User not found")
		}

		const result = await userService.updateUserPassword(user, oldPassword, newPassword!).toPromise()

		if (!result) {
			return ctx.throw(404, "User not found")
		}

		await tokenService.removeAllTokens(result.id)

		ctx.response.status = 204
	}
