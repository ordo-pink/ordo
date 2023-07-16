import { isEmail } from "#x/deno_validator@v0.0.5/mod.ts"
import { okpwd } from "#lib/okpwd/mod.ts"
import { useBody } from "#lib/be-use/mod.ts"
import { HandleSignUpFn, SignUpBody } from "../types.ts"

export const handleSignUp: HandleSignUpFn =
	({ userService, tokenService }) =>
	async ctx => {
		const { email, password } = await useBody<SignUpBody>(ctx)

		if (!email || !isEmail(email, {})) {
			return ctx.throw(400, "Invalid email")
		}

		const user = await userService.getByEmail(email)

		if (user) {
			return ctx.throw(409, "User with this email already exists")
		}

		const validatePassword = okpwd()
		const error = validatePassword(password)

		if (error) {
			return ctx.throw(400, error)
		}

		try {
			const newUser = await userService.createUser(email, password!)

			const id = newUser.id
			const ip = ctx.request.ip

			const accessToken = await tokenService.createAccessToken(id, ip)
			const refreshToken = await tokenService.createRefreshToken(id, ip)

			ctx.response.body = { accessToken, refreshToken }
		} catch (e) {
			ctx.throw(409, "User with this email already exists")
		}
	}
