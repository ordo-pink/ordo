// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Nullable, Unary } from "@ordo-pink/tau"
import type { Logger } from "@ordo-pink/logger"
import type { Oath } from "@ordo-pink/oath"
import { AUD, JTI, JWT, JWTPayload, SUB, Algorithm } from "@ordo-pink/wjwt"

// --- Public ---

/**
 * A record of refresh token ids and tokens.
 */
export type TokenRecord = Record<JTI, string>

/**
 * Payload of the access JWT.
 */
export type AccessTokenPayload = JWTPayload & { lim: number; fms: number; sbs: string }

/**
 * Payload of the refresh JWT.
 */
export type RefreshTokenPayload = AccessTokenPayload

/**
 * Parsed access token content.
 */
export type JWAT = JWT<AccessTokenPayload>

/**
 * Parsed refresh token content.
 */
export type JWRT = JWT<RefreshTokenPayload>

/**
 * `DataPersistenceStrategy` provides a set of methods used by the `DataService` to persist user
 * authentication history.
 */
export type TokenPersistenceStrategy = {
	/**
	 * Get token associated with given user id and token id.
	 *
	 * @rejects with `Error` if a database error occurs. Resolves with a token.
	 * @resolves with `null` if no reference to given user id is persisted.
	 * @resolves with `null` if token was not found.
	 * @resolves with an Oath of the token for given sub and jti.
	 */
	getToken(sub: SUB, jti: JTI): Oath<Nullable<string>, Error>

	/**
	 * Get an object that contains mapping of JTIs to corresponding tokens.
	 *
	 * @rejects with `Error` if a database error occurs.
	 * @resolves with `null` if no reference to given user id is persisted.
	 * @resolves with a record of JTIs to corresponding tokens.
	 */
	getTokenRecord(sub: SUB): Oath<Nullable<TokenRecord>, Error>

	/**
	 * Remove a token associated with given user id and token id.
	 *
	 * @rejects with `Error` if a database error occurs.
	 * @resolves with "OK" if user's token record did not contain the token hence it was not removed.
	 * @resolves with "OK".
	 */
	removeToken(sub: SUB, jti: JTI): Oath<"OK", Error>

	/**
	 * Remove token record of a user under given user id.
	 *
	 * @rejects with `Error` if a database error occurs.
	 * @resolves with "OK".
	 */
	removeTokenRecord(sub: SUB): Oath<"OK", Error>

	/**
	 * Set a token for given user id and token id.
	 *
	 * @rejects with `Error` if a database error occurs.
	 * @resolves with "OK".
	 */
	setToken(sub: SUB, jti: JTI, token: string): Oath<"OK", Error>

	/**
	 * Set token record for a user under given user id.
	 *
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
	) => Oath<Nullable<typeof type extends "access" ? AccessTokenPayload : RefreshTokenPayload>>

	decode: (
		token: string,
		type: "access" | "refresh",
	) => Oath<Nullable<typeof type extends "access" ? JWAT : JWRT>>

	createPair: Unary<
		{ sub: SUB; prevJti?: JTI; aud?: AUD; data?: Record<string, any> },
		Oath<RefreshTokenPayload & { tokens: { access: string; refresh: string } }, Error>
	>

	persistenceStrategy: TokenPersistenceStrategy
}
