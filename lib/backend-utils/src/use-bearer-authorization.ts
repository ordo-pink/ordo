// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Context } from "koa"
import { AccessTokenParsed, TTokenService } from "@ordo-pink/backend-token-service"
import { HttpError } from "@ordo-pink/rrr"
import { Oath } from "@ordo-pink/oath"

// TODO: Rewrite with Oath
export const useBearerAuthorization = (
	ctx: Context,
	tokenServiceOrIDHost: TTokenService | string
): Oath<AccessTokenParsed, HttpError> =>
	Oath.of(ctx.header.authorization)
		.chain(authorization =>
			Oath.fromBoolean(
				() =>
					Boolean(authorization) &&
					typeof authorization === "string" &&
					authorization.startsWith("Bearer "),
				() => authorization as string,
				() => HttpError.Unauthorized("Authorization token not provided")
			)
		)
		.map(authorization => authorization.slice(7))
		.chain(token =>
			typeof tokenServiceOrIDHost === "string"
				? verifyWithIdServer0(tokenServiceOrIDHost, token)
				: verifyWithTokenService0(tokenServiceOrIDHost, token)
		)

const verifyWithIdServer0 = (idHost: string, authorization: string) =>
	Oath.from(() =>
		fetch(`${idHost}/verify-token`, { method: "POST", headers: { authorization } })
			.then(res => res.json())
			.then(res => (res.success ? res.result : { valid: false }))
	)
		.chain(res =>
			res.success ? Oath.of(res.result) : Oath.reject(HttpError.Forbidden("Invalid token"))
		)
		.map(res => res.token)

const verifyWithTokenService0 = (tokenService: TTokenService, token: string) =>
	tokenService
		.verifyToken(token, "access")
		.chain(() => tokenService.decode(token, "access"))
		.rejectedMap(() => HttpError.Forbidden("Invalid token"))
		.toPromise() as any // TODO: Fix type inference for token type
