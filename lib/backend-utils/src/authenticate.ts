// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { Context } from "koa"

import { JWAT, TTokenService } from "@ordo-pink/backend-service-token"
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
		res.valid ? Oath.of(res.token) : Oath.Reject(HttpError.Forbidden("Invalid token")),
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
