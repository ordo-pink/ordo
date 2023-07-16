import { isEmail } from "#x/deno_validator@v0.0.5/mod.ts"
import { useBearerAuthorization, useBody } from "#lib/be-use/mod.ts"
import { ChangeEmailBody, ChangeEmailFn } from "../types.ts"

export const handleChangeEmail: ChangeEmailFn =
	({ tokenService, userService }) =>
	async ctx => {
		const { payload } = await useBearerAuthorization(ctx, tokenService)
		const { email } = await useBody<ChangeEmailBody>(ctx)

		if (!email || !isEmail(email, {})) {
			return ctx.throw(400, "Invalid password")
		}

		const id = payload.sub
		const user = await userService.getById(id)
		const emailTaken = await userService.getByEmail(email)

		if (!user) {
			return ctx.throw(404, "User not found")
		}

		if (emailTaken) {
			return ctx.throw(409, "Email already taken")
		}

		const result = await userService.update(user.id, { email })

		if (!result) {
			return ctx.throw(404, "User not found")
		}

		ctx.response.body = result
	}
