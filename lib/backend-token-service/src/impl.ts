// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

import type { Payload } from "#x/djwt@v2.9.1/mod.ts"
import type * as T from "./types.ts"

import { create, decode, getNumericDate, verify } from "#x/djwt@v2.9.1/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { F, pipe, thunkify } from "#ramda"

// TODO: Drop storing token values

// PUBLIC -----------------------------------------------------------------------------------------

/**
 * Creates a `TokenService` from given TokenStorageAdapter and `TokenService` options.
 * @see T.TokenRepository
 * @see T.TokenServiceOptions
 * @see T.TTokenService
 */
const service: T._Fn = params => ({
	verifyAccessToken: verifyToken(params.options.keys.access.public),
	verifyRefreshToken: verifyToken(params.options.keys.refresh.public),
	getAccessTokenPayload: getAccessTokenPayload(params.options.keys.access.public),
	getRefreshTokenPayload: getRefreshTokenPayload(params.options.keys.refresh.public),
	getPersistedToken: getRefreshToken(params.adapter),
	getPersistedTokens: getRefreshTokenMap(params.adapter),
	removePersistedToken: removeRefreshToken(params.adapter),
	removePersistedTokens: removeRefreshTokenMap(params.adapter),
	setPersistedToken: setRefreshToken(params.adapter),
	setPersistedTokens: setRefreshTokenMap(params.adapter),
	createTokens: createTokens(params),
	decodeAccessToken,
	decodeRefreshToken,
})

export const TokenService = {
	of: service,
}

// INTERNAL ---------------------------------------------------------------------------------------

const getTokenPayload: T._GetTokenPayloadFn<Payload> = key =>
	pipe(
		thunkify((token: string) => verify(token, key)),
		Oath.from,
		o => o.rejectedMap(() => null)
	)

const decodeToken: T._DecodePayloadFn<T.TokenParsed> = token =>
	Oath.try(() => decode(token))
		.rejectedMap(console.error)
		.rejectedMap(() => null)
		.map(([header, payload, signature]) => ({ header, payload, signature } as T.TokenParsed))

const decodeAccessToken = decodeToken as T._DecodePayloadFn<T.AccessTokenParsed>

const decodeRefreshToken = decodeToken as T._DecodePayloadFn<T.RefreshTokenParsed>

const verifyToken: T._VerifyToken = key =>
	pipe(
		getTokenPayload(key),
		o => o.map(Boolean),
		o => o.fix(F)
	)

const getAccessTokenPayload = getTokenPayload as T._GetTokenPayloadFn<T.AccessTokenPayload>

const getRefreshTokenPayload = getTokenPayload as T._GetTokenPayloadFn<T.RefreshTokenPayload>

const getRefreshToken: T._GetTokenFn = adapter => (sub, jti) =>
	adapter
		.getToken(sub, jti)
		.rejectedMap(console.error)
		.rejectedMap(() => null)

const getRefreshTokenMap: T._GetTokenRecordFn = adapter => sub =>
	adapter
		.getTokenRecord(sub)
		.rejectedMap(console.error)
		.rejectedMap(() => null)

const removeRefreshToken: T._RemoveTokenFn = adapter => (sub, jti) =>
	adapter
		.removeToken(sub, jti)
		.rejectedMap(console.error)
		.rejectedMap(() => null)

const removeRefreshTokenMap: T._RemoveTokenRecordFn = adapter => sub =>
	adapter
		.removeTokenRecord(sub)
		.rejectedMap(console.error)
		.rejectedMap(() => null)

const setRefreshToken: T._SetTokenFn = adapter => (sub, jti, token) =>
	adapter
		.setToken(sub, jti, token)
		.rejectedMap(console.error)
		.rejectedMap(() => null)

const setRefreshTokenMap: T._SetTokenRecordFn = adapter => (sub, map) =>
	adapter
		.setTokenRecord(sub, map)
		.rejectedMap(console.error)
		.rejectedMap(() => null)

const createEXP: T._CreateEXPFn = length => getNumericDate(length)

const createJTI: T._CreateJTIFn = () => crypto.randomUUID()

const createIAT: T._CreateIATFn = () => Date.now()

const createISS: T._CreateISSFn = () => "https://id.ordo.pink"

// TODO: Remove old token when creating new token (provide jti)
const createTokens: T._CreateTokensFn =
	params =>
	({ sub, uip, prevJti, aud = "https://ordo.pink" }) =>
		Oath.all({
			jti: createJTI(),
			iat: createIAT(),
			iss: createISS(),
			aexp: createEXP(params.options.accessTokenExpireIn),
			rexp: createEXP(params.options.refreshTokenExpireIn),
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
				access: create(
					{ alg: params.options.alg, type: "JWT" },
					{ jti, iat, iss, aexp, sub, aud },
					params.options.keys.access.private
				),
				refresh: create(
					{ alg: params.options.alg, type: "JWT" },
					{ jti, iat, iss, rexp, sub, aud, uip },
					params.options.keys.refresh.private
				),
			}).chain(res =>
				prevJti
					? service(params)
							.removePersistedToken(sub, prevJti)
							.chain(() => service(params).setPersistedToken(sub, jti, res.refresh))
							.map(() => res)
					: Oath.empty()
							.chain(() => service(params).setPersistedToken(sub, jti, res.refresh))
							.map(() => res)
			)
		)
