import type { Context, RouterMiddleware } from "#x/oak@v12.6.0/mod.ts"
import type { PublicUser, UserService } from "#lib/user-service/mod.ts"
import type { TokenService } from "#lib/token-service/mod.ts"

import { ResponseError, THttpError, useBearerAuthorization } from "#lib/be-use/mod.ts"
import { Oath } from "#lib/oath/mod.ts"

// Public -----------------------------------------------------------------------------------------

export type Params = { tokenService: TokenService; userService: UserService }
export type Fn = (params: Params) => RouterMiddleware<"/users/:email">

export const handleUserInfo: Fn =
	({ tokenService, userService }) =>
	async ctx =>
		Oath.from(() => useBearerAuthorization(ctx, tokenService))
			.map(() => ctx.params.email)
			.chain(getPublicUserByEmail(userService))
			.fork(ResponseError.send(ctx), sendUserInfo(ctx))

// Internal ---------------------------------------------------------------------------------------

// Get user entity by id --------------------------------------------------------------------------

type GetUserByEmailFn = (service: UserService) => (email: string) => Oath<PublicUser, THttpError>

const getPublicUserByEmail: GetUserByEmailFn = userService => email =>
	userService.getUserInfo(email).rejectedMap(ResponseError.create(404, "User not found"))

// Send account info in response ------------------------------------------------------------------

type SendUserInfoFn = (ctx: Context) => (user: PublicUser) => void

const sendUserInfo: SendUserInfoFn = ctx => user => {
	ctx.response.body = user
}
