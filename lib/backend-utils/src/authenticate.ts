// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Context } from "koa"
import { JWAT, TTokenService } from "@ordo-pink/backend-token-service"
import { HttpError } from "@ordo-pink/rrr"
import { Oath } from "@ordo-pink/oath"

export const authenticate0 = (
	ctx: Context,
	tokenServiceOrIDHost: TTokenService | string,
): Oath<JWAT, HttpError> =>
	Oath.of(ctx.header.authorization)
		.chain(authorization =>
			Oath.fromBoolean(
				() =>
					Boolean(authorization) &&
					typeof authorization === "string" &&
					authorization.startsWith("Bearer "),
				() => authorization as string,
				() => HttpError.Unauthorized("Authorization token not provided"),
			),
		)
		.chain(token =>
			typeof tokenServiceOrIDHost === "string"
				? verifyWithIdServer0(tokenServiceOrIDHost, token)
				: verifyWithTokenService0(tokenServiceOrIDHost, token.slice(7)),
		)

const verifyWithIdServer0 = (idHost: string, authorization: string) =>
	Oath.from(() =>
		fetch(`${idHost}/verify-token`, {
			method: "POST",
			headers: { authorization },
		})
			.then(res => res.json())
			.then(res => (res.success ? res.result : { valid: false })),
	).chain(res =>
		res.valid ? Oath.of(res.token) : Oath.reject(HttpError.Forbidden("Invalid token")),
	)

const verifyWithTokenService0 = (tokenService: TTokenService, token: string) =>
	tokenService
		.verifyToken(token, "access")
		.chain(isValid =>
			Oath.fromBoolean(
				() => isValid,
				() => "OK",
				() => HttpError.Forbidden("Invalid token"),
			),
		)
		.chain(() => tokenService.decode(token, "access"))
