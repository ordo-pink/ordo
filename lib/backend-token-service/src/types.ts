// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Jwt, JwtHeader, JwtPayload, Algorithm } from "jsonwebtoken"
import type { Nullable, Unary } from "@ordo-pink/tau"
import type { Logger } from "@ordo-pink/logger"
import type { Oath } from "@ordo-pink/oath"
import type { KeyObject } from "crypto"

// --- Public ---

/**
 * A record of refresh token ids and tokens.
 */
export type TokenRecord = Record<JTI, string>

/**
 * A pair of CryptoKeys.
 */
export type CryptoKeyPair = {
	/**
	 * Private CryptoKey used for signing.
	 */
	readonly private: KeyObject

	/**
	 * Public CryptoKey used for verifying.
	 */
	readonly public: KeyObject
}

/**
 * @see AccessTokenPayload.sub
 */
export type SUB = string

/**
 * @see AccessTokenPayload.aud
 */
export type AUD = string

/**
 * @see AccessTokenPayload.iat
 */
export type IAT = number

/**
 * @see AccessTokenPayload.jti
 */
export type JTI = string

/**
 * @see AccessTokenPayload.iss
 */
export type ISS = string

/**
 * @see AccessTokenPayload.exp
 */
export type EXP = number

/**
 * Payload of the access JWT.
 */
export interface AccessTokenPayload extends JwtPayload {
	/**
	 * JWT subject. User id is stored here.
	 */
	readonly sub: SUB

	/**
	 * JWT audience.
	 * @default "https://ordo.pink"
	 */
	readonly aud: AUD

	/**
	 * JWT issue time stamp.
	 */
	readonly iat: IAT

	/**
	 * JWT id. This value is the same for refresh token and access token. This way access token can
	 * be revoked even if its expiration time hasn't come yet.
	 */
	readonly jti: JTI

	/**
	 * JWT issuer.
	 * @default "https://id.ordo.pink"
	 */
	readonly iss: ISS

	/**
	 * JWT expiration time stamp.
	 */
	readonly exp: EXP
}

/**
 * Payload of the refresh JWT.
 */
export interface RefreshTokenPayload extends AccessTokenPayload {}

/**
 * Parsed token content.
 */
export type TokenParsed<TPayload extends JwtPayload = JwtPayload> = {
	/**
	 * @see JwtHeader
	 */
	readonly header: JwtHeader

	/**
	 * @see Payload
	 */
	readonly payload: TPayload

	/**
	 * JWT signature.
	 * @type {Uint8Array}
	 */
	readonly signature: Uint8Array
}

/**
 * Parsed access token content.
 */
export type AccessTokenParsed = TokenParsed<AccessTokenPayload>

/**
 * Parsed refresh token content.
 */
export type RefreshTokenParsed = TokenParsed<RefreshTokenPayload>

/**
 * Token storage adapter is used as an adapter over a database driver that provides a small set of
 * specific methods that can TokenService will use to store required data. This type defines the
 * list of methods and type-level implementation details of what TokenService provides and what it
 * expects to get back.
 */
export type TokenRepository = {
	/**
	 * Get token associated with given user id and token id.
	 * @rejects with `Error` if a database error occurs. Resolves with a token.
	 * @resolves with `null` if no reference to given user id is persisted.
	 * @resolves with `null` if token was not found.
	 * @resolves with an Oath of the token for given sub and jti.
	 */
	getToken(sub: SUB, jti: JTI): Oath<Nullable<string>, Error>

	/**
	 * Get an object that contains mapping of JTIs to corresponding tokens.
	 * @rejects with `Error` if a database error occurs.
	 * @resolves with `null` if no reference to given user id is persisted.
	 * @resolves with a record of JTIs to corresponding tokens.
	 */
	getTokenRecord(sub: SUB): Oath<Nullable<TokenRecord>, Error>

	/**
	 * Remove a token associated with given user id and token id.
	 * @rejects with `Error` if a database error occurs.
	 * @resolves with "OK" if user's token record did not contain the token hence it was not removed.
	 * @resolves with "OK".
	 */
	removeToken(sub: SUB, jti: JTI): Oath<"OK", Error>

	/**
	 * Remove token record of a user under given user id.
	 * @rejects with `Error` if a database error occurs.
	 * @resolves with "OK".
	 */
	removeTokenRecord(sub: SUB): Oath<"OK", Error>

	/**
	 * Set a token for given user id and token id.
	 * @rejects with `Error` if a database error occurs.
	 * @resolves with "OK".
	 */
	setToken(sub: SUB, jti: JTI, token: string): Oath<"OK", Error>

	/**
	 * Set token record for a user under given user id.
	 * @rejects with `Error` if a database error occurs.
	 * @resolves with "OK"
	 */
	setTokenRecord(sub: SUB, map: TokenRecord): Oath<"OK", Error>
}

/**
 * Options for configuring TokenService on creation.
 */
export type TokenServiceOptions = {
	/**
	 * A chain of CryptoKeys for signing and verifying tokens.
	 */
	readonly keys: {
		/**
		 * Access token CryptoKeys.
		 */
		readonly access: CryptoKeyPair

		/**
		 * Refresh token CryptoKeys.
		 */
		readonly refresh: CryptoKeyPair
	}

	/**
	 * @see Algorithm
	 */
	readonly alg: Algorithm

	/**
	 * Lifetime of an access token in seconds.
	 */
	readonly accessTokenExpireIn: number

	/**
	 * Lifetime of a refresh token in seconds.
	 */
	readonly refreshTokenExpireIn: number

	/**
	 * Dedicated logger.
	 */
	readonly logger: Logger
}

export type TTokenService = {
	verifyToken: (token: string, type: "access" | "refresh") => Oath<boolean>

	getPayload: (
		token: string,
		type: "access" | "refresh",
	) => Oath<Nullable<typeof type extends "access" ? AccessTokenParsed : RefreshTokenParsed>>

	decode: (
		token: string,
		type: "access" | "refresh",
	) => Oath<Nullable<typeof type extends "access" ? AccessTokenParsed : RefreshTokenParsed>>

	createPair: Unary<
		{ sub: SUB; prevJti?: JTI; aud?: AUD },
		Oath<RefreshTokenPayload & { tokens: { access: string; refresh: string } }, Error>
	>

	repository: TokenRepository
}
