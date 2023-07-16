import { useBearerAuthorization } from "#lib/be-use/mod.ts"
import { HandleUserInfoFn } from "../types.ts"

export const handleUserInfo: HandleUserInfoFn =
	({ tokenService, userService }) =>
	async ctx => {
		await useBearerAuthorization(ctx, tokenService)

		const email = ctx.params.email
		const user = await userService.getUserInfo(email)

		if (!user) {
			return ctx.throw(404, "User not found")
		}

		ctx.response.body = user
	}
