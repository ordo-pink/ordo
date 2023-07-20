import { useBearerAuthorization } from "#lib/be-use/mod.ts"
import { TokenMap } from "#lib/token-service/mod.ts"
import { HandleSignOutFn } from "../types.ts"

export const handleSignOut: HandleSignOutFn =
	({ tokenService }) =>
	async ctx => {
		const { payload } = await useBearerAuthorization(ctx, tokenService)
		const { sub, jti } = payload

		const tokenMap = (await tokenService.getTokens(sub)).getOrElse(
			() => ({} as TokenMap)
		)

		if (!tokenMap || !tokenMap[jti]) {
			return ctx.throw(403, "Unverified or outdated access token")
		}

		await tokenService.removeToken(sub, jti)

		await ctx.cookies.delete("jti")
		await ctx.cookies.delete("sub")

		ctx.response.status = 204
	}
