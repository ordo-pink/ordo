// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

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
		})
			.then(res => res.json())
			.then(res => (res.success ? res.result : { valid: false }))

		if (body.valid) return body.token

		ctx.throw(403, "Invalid or outdated token")
	} else {
		const verified = await tokenServiceOrIDHost.verifyAccessToken(token).toPromise()

		if (!verified) {
			return ctx.throw(403, "Invalid or outdated token")
		}

		return tokenServiceOrIDHost.decodeAccessToken(token).toPromise()
	}
}