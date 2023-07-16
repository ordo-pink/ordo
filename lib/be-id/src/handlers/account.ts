import { useBearerAuthorization } from "#lib/be-use/mod.ts"
import { HandleAccountFn } from "../types.ts"

export const handleAccount: HandleAccountFn =
	({ tokenService, userService }) =>
	async ctx => {
		const { payload } = await useBearerAuthorization(ctx, tokenService)

		const id = payload.sub
		const user = await userService.getById(id)

		if (!user) {
			return ctx.throw(404, "User not found")
		}

		ctx.response.body = user
	}
