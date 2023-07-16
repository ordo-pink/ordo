import { okpwd } from "#lib/okpwd/mod.ts"
import { useBearerAuthorization, useBody } from "#lib/be-use/mod.ts"
import { ChangePasswordBody, ChangePasswordFn } from "../types.ts"

export const handleChangePassword: ChangePasswordFn =
	({ tokenService, userService }) =>
	async ctx => {
		const { payload } = await useBearerAuthorization(ctx, tokenService)
		const { oldPassword, newPassword } = await useBody<ChangePasswordBody>(ctx)
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
		const user = await userService.getById(id)

		if (!user) {
			return ctx.throw(404, "User not found")
		}

		const passwordVerified = await userService.comparePassword(
			user.email,
			oldPassword
		)

		if (!passwordVerified) {
			return ctx.throw(404, "User not found")
		}

		const result = await userService.updateUserPassword(
			user,
			oldPassword,
			newPassword!
		)

		if (!result) {
			return ctx.throw(404, "User not found")
		}

		await tokenService.remove(result.id)

		ctx.response.status = 204
	}
