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

import type { AUD, Algorithm, JTI, JWT, JWTPayload, SUB } from "@ordo-pink/wjwt"
import type { Logger } from "@ordo-pink/logger"
import type { Oath } from "@ordo-pink/oath"
import type { Unary } from "@ordo-pink/tau"

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
	getToken(sub: SUB, jti: JTI): Oath<string | null, Error>

	/**
	 * Get an object that contains mapping of JTIs to corresponding tokens.
	 *
	 * @rejects with `Error` if a database error occurs.
	 * @resolves with `null` if no reference to given user id is persisted.
	 * @resolves with a record of JTIs to corresponding tokens.
	 */
	getTokenRecord(sub: SUB): Oath<TokenRecord | null, Error>

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
	) => Oath<typeof type extends "access" ? AccessTokenPayload : RefreshTokenPayload | null>

	decode: (
		token: string,
		type: "access" | "refresh",
	) => Oath<typeof type extends "access" ? JWAT : JWRT | null>

	createPair: Unary<
		{ sub: SUB; prevJti?: JTI; aud?: AUD; data?: Record<string, any> },
		Oath<RefreshTokenPayload & { tokens: { access: string; refresh: string } }, Error>
	>

	persistenceStrategy: TokenPersistenceStrategy
}
