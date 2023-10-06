// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { randomUUID } from "crypto"
import { WJWT } from "@ordo-pink/wjwt"

import { Oath } from "@ordo-pink/oath"
import { TTokenService, TokenRepository, TokenServiceOptions } from "./types"
import { Switch } from "@ordo-pink/switch"
import { UUIDv4 } from "@ordo-pink/tau"

type Params = { repository: TokenRepository; options: TokenServiceOptions }

/**
 * Creates a `TokenService` from given TokenStorageAdapter and `TokenService` options.
 * @see TokenRepository
 * @see TokenServiceOptions
 * @see of
 */
const of = ({ repository, options }: Params): TTokenService => {
	const refreshWJWT = WJWT({
		alg: options.alg,
		privateKey: options.keys.refresh.privateKey,
		publicKey: options.keys.refresh.publicKey,
	})

	const accessWJWT = WJWT({
		alg: options.alg,
		privateKey: options.keys.access.privateKey,
		publicKey: options.keys.access.publicKey,
	})

	const wjwt = (type: "access" | "refresh") =>
		Switch.of(type)
			.case("refresh", () => refreshWJWT)
			.default(() => accessWJWT)

	return {
		repository,
		verifyToken: (token, type) =>
			wjwt(type)
				.verify0(token)
				.fix(() => false),
		getPayload: (token, type) =>
			wjwt(type)
				.verify0(token)
				.chain(valid =>
					Oath.fromBoolean(
						() => valid,
						() => token,
						() => null,
					),
				)
				.chain(token => wjwt(type).decode0(token))
				.map(jwt => jwt.payload as any)
				.chain(payload => repository.getToken(payload.sub, payload.jti).map(() => payload))
				.fix(() => null),
		decode: token =>
			wjwt("access")
				.decode0(token)
				.fix(() => null) as any,
		createPair: ({ sub, prevJti, aud = ["https://ordo.pink"], data = {} }) =>
			Oath.all({
				jti: randomUUID() as UUIDv4,
				iat: Math.floor(Date.now() / 1000),
				iss: "https://id.ordo.pink",
				aexp: Math.floor(Date.now() / 1000) + options.accessTokenExpireIn,
				rexp: Math.floor(Date.now() / 1000) + options.refreshTokenExpireIn,
				sub,
				aud,
			}).chain(({ jti, iat, iss, aexp, rexp, sub, aud }) =>
				Oath.all({
					jti,
					iat,
					iss,
					exp: rexp,
					sub,
					aud,
					tokens: Oath.all({
						access: accessWJWT.sign0({ ...data, jti, iat, iss, exp: aexp, sub, aud }),
						refresh: refreshWJWT.sign0({ ...data, jti, iat, iss, exp: rexp, sub, aud }),
					}),
				}).chain(res =>
					prevJti
						? repository
								.removeToken(sub, prevJti)
								.chain(() => repository.setToken(sub, jti, res.tokens.refresh))
								.map(() => res as any)
						: Oath.empty()
								.chain(() => repository.setToken(sub, jti, res.tokens.refresh))
								.map(() => res),
				),
			),
	}
}

export const TokenService = { of }
