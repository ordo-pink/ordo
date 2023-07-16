import { isJWT } from "#x/deno_validator@v0.0.5/mod.ts"
import { useBody } from "#lib/be-use/mod.ts"
import { RefreshTokenBody, HandleRefreshTokenFn } from "../types.ts"

export const handleRefreshToken: HandleRefreshTokenFn =
	({ tokenService }) =>
	async ctx => {
		const { refreshToken } = await useBody<RefreshTokenBody>(ctx)

		if (
			!refreshToken ||
			!isJWT(refreshToken) ||
			!(await tokenService.verify(refreshToken))
		) {
			return ctx.throw(400, "Invalid refresh token")
		}

		const { payload } = tokenService.decode(refreshToken)
		const id = payload.sub
		const ip = ctx.request.ip

		const tokenMap = await tokenService.get(id)

		if (!tokenMap || !tokenMap[ip] || tokenMap[ip] !== refreshToken) {
			return ctx.throw(403, "Token expired")
		}

		const accessToken = await tokenService.createAccessToken(id, ip)
		const rt = await tokenService.createRefreshToken(id, ip)

		ctx.response.body = { accessToken, refreshToken: rt }
	}
