import { Application, Router } from "#x/oak@v12.6.0/mod.ts"
import { UserAdapter, UserService } from "#lib/user-service/mod.ts"
import { IDKeyChain, TokenAdapter, TokenService } from "#lib/token-service/mod.ts"
import { oakCors } from "#x/cors@v1.2.2/oakCors.ts"
import { handleAccount } from "./handlers/account.ts"
import { handleChangeEmail } from "./handlers/change-email.ts"
import { handleChangePassword } from "./handlers/change-password.ts"
import { handleRefreshToken } from "./handlers/refresh-token.ts"
import { handleSignIn } from "./handlers/sign-in.ts"
import { handleSignOut } from "./handlers/sign-out.ts"
import { handleSignUp } from "./handlers/sign-up.ts"
import { handleUserInfo } from "./handlers/user-info.ts"
import { handleError } from "./middleware/handle-error.ts"
import { logRequest } from "./middleware/log-request.ts"
import { setResponseTimeHeader } from "./middleware/response-time.ts"
import { Algorithm } from "#x/djwt@v2.9.1/algorithm.ts"

// TODO: Extract errors to enum
// TODO: Audit
export type CreateIDServerFnParams = {
	userDriver: UserAdapter
	tokenDriver: TokenAdapter
	accessTokenExpireIn: number
	refreshTokenExpireIn: number
	saltRounds: number
	origin: string
	alg: Algorithm
	keys: IDKeyChain
}

export type CreateIDServerFn = (params: CreateIDServerFnParams) => Promise<Application>

export const createIDServer: CreateIDServerFn = async ({
	userDriver,
	tokenDriver,
	origin,
	accessTokenExpireIn,
	refreshTokenExpireIn,
	keys,
	saltRounds,
	alg,
}) => {
	const router = new Router()

	const userService = await UserService.of(userDriver, { saltRounds })
	const tokenService = await TokenService.of(tokenDriver, {
		accessTokenExpireIn,
		refreshTokenExpireIn,
		alg,
		keys,
	})

	router.get("/healthcheck", ctx => {
		ctx.response.body = "OK"
		ctx.response.status = 200
	})

	router.post("/sign-up", handleSignUp({ userService, tokenService }))
	router.post("/sign-in", handleSignIn({ userService, tokenService }))
	router.post("/sign-out", handleSignOut({ userService, tokenService }))
	router.post("/refresh-token", handleRefreshToken({ userService, tokenService }))
	router.get("/account", handleAccount({ userService, tokenService }))
	router.get("/users/:email", handleUserInfo({ userService, tokenService }))
	router.patch("/change-email", handleChangeEmail({ userService, tokenService }))
	router.patch("/change-password", handleChangePassword({ userService, tokenService }))

	// router.get("/avatar", ctx => {
	// 	ctx.response.body = "TODO"
	// })

	// router.get("/send-activation-email/:email", ctx => {
	// 	ctx.response.body = "TODO"
	// })

	// router.get("/send-forgot-password-email/:email", ctx => {
	// 	ctx.response.body = "TODO"
	// })

	// router.get("/activate", ctx => {
	// 	ctx.response.body = "TODO"
	// })

	// router.post("/forgot-password", ctx => {
	// 	ctx.response.body = "TODO"
	// })

	// TODO: Redirect if cookies are present and valid
	const app = new Application({
		state: {
			logger: {
				log: console.log,
			},
		},
	})

	app.use(logRequest({ color: true }))
	app.use(setResponseTimeHeader)
	app.use(handleError)
	app.use(oakCors({ origin }))
	app.use(router.routes())
	app.use(router.allowedMethods())

	return app as any
}
