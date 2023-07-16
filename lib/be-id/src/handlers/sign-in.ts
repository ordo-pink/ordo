import { isEmail } from "#x/deno_validator@v0.0.5/mod.ts"
import { useBody } from "#lib/be-use/mod.ts"
import { HandleSignInFn, SignInBody } from "../types.ts"

export const handleSignIn: HandleSignInFn =
	({ userService, tokenService }) =>
	async ctx => {
		const { email, password } = await useBody<SignInBody>(ctx)

		if (!email || !isEmail(email, {})) {
			return ctx.throw(400, "Invalid email")
		}

		if (!password) {
			return ctx.throw(400, "Invalid password")
		}

		const user = await userService.getByEmail(email)
		const passwordIsValid = await userService.comparePassword(email, password)

		if (!user || !passwordIsValid) {
			return ctx.throw(404, "User not found")
		}

		const id = user.id
		const ip = ctx.request.ip

		const accessToken = await tokenService.createAccessToken(id, ip)
		const refreshToken = await tokenService.createRefreshToken(id, ip)

		ctx.response.body = { accessToken, refreshToken }
	}
