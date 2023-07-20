import type { Context, Middleware } from "#x/oak@v12.6.0/mod.ts"
import type { SUB, TokenService, AccessTokenParsed } from "#lib/token-service/mod.ts"
import type { User, UserService } from "#lib/user-service/mod.ts"

import { ResponseError, THttpError } from "#lib/be-use/src/user-error.ts"
import { useBearerAuthorization } from "#lib/be-use/mod.ts"
import { Oath } from "#lib/oath/mod.ts"

// Public -----------------------------------------------------------------------------------------

type Params = { tokenService: TokenService; userService: UserService }
type Fn = (params: Params) => Middleware

export const handleAccount: Fn =
	({ tokenService, userService }) =>
	ctx =>
		Oath.from(() => useBearerAuthorization(ctx, tokenService))
			.map(extractUserIdFromTokenPayload)
			.chain(getUserById(userService))
			.fork(ResponseError.send(ctx), sendAccountInfo(ctx))

// Internal ---------------------------------------------------------------------------------------

// Extract user id from the token payload ---------------------------------------------------------

type ExtractUserIdFn = (token: AccessTokenParsed) => SUB

const extractUserIdFromTokenPayload: ExtractUserIdFn = ({ payload }) => payload.sub

// Get user entity by id --------------------------------------------------------------------------

type GetUserByIdFn = (service: UserService) => (id: SUB) => Oath<User, THttpError>

const getUserById: GetUserByIdFn = userService => id =>
	userService.getById(id).rejectedMap(ResponseError.create(404, "User not found"))

// Send account info in response ------------------------------------------------------------------

type SendAccountInfoFn = (ctx: Context) => (user: User) => void

const sendAccountInfo: SendAccountInfoFn = ctx => user => {
	ctx.response.body = user
}
