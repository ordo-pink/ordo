import { useBearerAuthorization } from "#lib/be-use/mod.ts"
import { HandleSignOutFn } from "../types.ts"

export const handleSignOut: HandleSignOutFn =
	({ tokenService }) =>
	async ctx => {
		// TODO: Signing out from other devices (https://deno.land/x/location@1.1.0/iplocationservice.ts)
		const { payload } = await useBearerAuthorization(ctx, tokenService)

		const id = payload.sub
		const ip = ctx.request.ip

		const tokenMap = await tokenService.get(id)

		if (!tokenMap || !tokenMap[ip]) {
			return ctx.throw(403, "Unverified or outdated access token")
		}

		await tokenService.remove(id, ip)

		ctx.response.status = 204
	}
