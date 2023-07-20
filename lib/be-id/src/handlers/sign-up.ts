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

		const user = await userService.getByEmail(email).fork(
			() => null,
			user => user
		)

		if (user) {
			return ctx.throw(409, "User with this email already exists")
		}

		const validatePassword = okpwd()
		const error = validatePassword(password)

		if (error) {
			return ctx.throw(400, error)
		}

		try {
			const newUser = await userService.createUser(email, password!).toPromise()

			const sub = newUser.id
			const uip = ctx.request.ip

			const { jti, exp } = await tokenService.createRefreshToken(sub, uip)
			const accessToken = await tokenService.createAccessToken(jti, sub)

			await ctx.cookies.set("jti", jti, {
				httpOnly: true,
				sameSite: "lax",
				expires: new Date(Date.now() + exp),
			})

			await ctx.cookies.set("sub", sub, {
				httpOnly: true,
				sameSite: "lax",
				expires: new Date(Date.now() + exp),
			})

			ctx.response.body = { accessToken, refreshToken: jti, userId: sub }
		} catch (e) {
			console.log(e)

			ctx.throw(409, "User with this email already exists")
		}
	}
