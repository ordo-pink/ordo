// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { randomUUID } from "crypto"
import { JwtPayload, decode, verify, sign } from "jsonwebtoken"

import { Oath } from "@ordo-pink/oath"
import { TTokenService, TokenRepository, TokenServiceOptions } from "./types"

type Params = { repository: TokenRepository; options: TokenServiceOptions }

const getSecret = (
	options: TokenServiceOptions,
	type: "access" | "refresh",
	visibility: "public" | "private",
) => options.keys[type][visibility]

/**
 * Creates a `TokenService` from given TokenStorageAdapter and `TokenService` options.
 * @see TokenRepository
 * @see TokenServiceOptions
 * @see of
 */
const of = ({ repository, options }: Params): TTokenService => ({
	repository,
	verifyToken: (token, type) =>
		TokenService.of({ repository, options }).getPayload(token, type).map(Boolean),
	getPayload: (token, type) =>
		Oath.try(() => verify(token, getSecret(options, type, "public"), { complete: true }))
			.map(token => token.payload as JwtPayload)
			.chain(payload => repository.getToken(payload.sub!, payload.jti!).map(() => payload))
			.fix(() => null) as any,
	decode: token => Oath.try(() => decode(token, { complete: true })).fix(() => null) as any,
	createPair: ({ sub, uip, prevJti, aud = "https://ordo.pink" }) =>
		Oath.all({
			jti: randomUUID(),
			iat: Math.floor(Date.now() / 1000),
			iss: "https://id.ordo.pink",
			aexp: Math.floor(Date.now() / 1000) + options.accessTokenExpireIn,
			rexp: Math.floor(Date.now() / 1000) + options.refreshTokenExpireIn,
			sub,
			aud,
			uip,
		}).chain(({ jti, iat, iss, aexp, rexp, sub, aud, uip }) =>
			Oath.all({
				jti,
				iat,
				iss,
				exp: rexp,
				sub,
				aud,
				uip,
				tokens: {
					access: sign(
						{ jti, iat, iss, exp: aexp, sub, aud },
						getSecret(options, "access", "private"),
						{ algorithm: options.alg },
					),
					refresh: sign(
						{ jti, iat, iss, exp: rexp, sub, aud, uip },
						getSecret(options, "refresh", "private"),
						{ algorithm: options.alg },
					),
				},
			}).chain(res =>
				prevJti
					? repository
							.removeToken(sub, prevJti)
							.chain(() => repository.setToken(sub, jti, res.tokens.refresh))
							.map(() => res)
					: Oath.empty()
							.chain(() => repository.setToken(sub, jti, res.tokens.refresh))
							.map(() => res),
			),
		),
})

export const TokenService = { of }
