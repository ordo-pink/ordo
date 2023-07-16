import { Context } from "#x/oak@v12.6.0/mod.ts"
import { TokenService } from "#lib/token-service/mod.ts"

export const useBearerAuthorization = async (
	ctx: Context,
	tokenService: TokenService
) => {
	const authorization = ctx.request.headers.get("Authorization")

	if (!authorization || !authorization.startsWith("Bearer ")) {
		return ctx.throw(401, "Unauthorized")
	}

	const token = authorization.slice(7)
	const verified = await tokenService.verify(token)

	if (!verified) {
		return ctx.throw(403, "Unverified or outdated access token")
	}

	return tokenService.decode(token) // TODO: types
}
