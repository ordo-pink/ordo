// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

import { Context } from "#x/oak@v12.6.0/mod.ts"
import { AccessTokenParsed, TTokenService } from "#lib/backend-token-service/mod.ts"

// TODO: Rewrite with Oath
export const useBearerAuthorization = async (
	ctx: Context,
	tokenServiceOrIDHost: TTokenService | string
): Promise<AccessTokenParsed> => {
	const authorization = ctx.request.headers.get("Authorization")

	if (!authorization || !authorization.startsWith("Bearer ")) {
		return ctx.throw(401, "Unauthorized")
	}

	const token = authorization.slice(7)

	if (typeof tokenServiceOrIDHost === "string") {
		const body = await fetch(`${tokenServiceOrIDHost}/verify-token`, {
			method: "POST",
			headers: { authorization },
		}).then(res => res.json())

		if (body.token === "valid") return body.token

		ctx.throw(403, "Unverified or outdated access token")
	} else {
		const verified = await tokenServiceOrIDHost.verifyAccessToken(token).toPromise()

		if (!verified) {
			return ctx.throw(403, "Unverified or outdated access token")
		}

		return tokenServiceOrIDHost.decodeAccessToken(token).toPromise()
	}
}
