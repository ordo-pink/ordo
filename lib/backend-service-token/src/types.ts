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

import type { AUD, Algorithm, ISS, JTI, JWT, JWTPayload, SUB } from "@ordo-pink/wjwt"
import type { Oath } from "@ordo-pink/oath"
import type { TLogger } from "@ordo-pink/logger"
import type { TOption } from "@ordo-pink/option"
import type { TRrr } from "@ordo-pink/managers"

// --- Public ---

/**
 * A record of refresh token ids and tokens.
 */
export type TTokenRecord = Record<JTI, string>

/**
 * Payload of the auth JWT.
 */
export type TAuthTokenPayload = JWTPayload & {
	/**
	 * @alias lim `user.file_limit`
	 */
	lim: number

	/**
	 * @alias mfs `user.max_file_size`
	 */
	mfs: number

	/**
	 * @alias sbs `user.subscription`
	 */
	sbs: string

	/**
	 * @alias mxf `user.max_functions`
	 */
	mxf: number
}

/**
 * Parsed access token content.
 */
export type TAuthJWT = JWT<TAuthTokenPayload>

/**
 * Token persistence strategy implements approach to storing user tokens in the backend. Token
 * persistence strategy is provided to `ID` service at start time and is then used for server side
 * validation of incoming request authorisation tokens (JWT access tokens).
 */
export type TPersistenceStrategyToken = {
	/**
	 * Returns refresh token of given `SUB` associated with given `JTI`.
	 *
	 * @param SUB - token subject
	 * @param JTI - token id
	 *
	 * @returns an Oath resolving into an option of the token or rejecting with `EIO`
	 */
	get_token: (sub: SUB, jti: JTI) => Oath<TOption<string>, TRrr<"EIO">>

	/**
	 * Returns a record of all refresh tokens associated with given `SUB`.
	 */
	get_tokens: (sub: SUB) => Oath<TOption<TTokenRecord>, TRrr<"EIO">>

	/**
	 * Removes refresh token of given `SUB` associated with given `JTI`.
	 */
	remove_token: (sub: SUB, jti: JTI) => Oath<void, TRrr<"EIO" | "ENOENT">>

	/**
	 * Removes a record of all refresh tokens associated with given `SUB`.
	 */
	remove_tokens: (sub: SUB) => Oath<void, TRrr<"EIO" | "ENOENT">>

	/**
	 * Assigns refresh token of given `SUB` associated with given `JTI`.
	 */
	set_token: (sub: SUB, jti: JTI, token: string) => Oath<void, TRrr<"EIO">>

	/**
	 * Assigns a record of all refresh tokens associated with given `SUB`.
	 */
	set_tokens: (sub: SUB, record: TTokenRecord) => Oath<void, TRrr<"EIO">>
}

/**
 * Options for configuring TokenService on creation.
 */
export type TTokenServiceOptions = {
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
	 * Recipients that the JWT is intended for.
	 */
	readonly audience: AUD

	/**
	 * JWT issuer claim.
	 */
	readonly issuer: ISS

	/**
	 * @see Algorithm
	 */
	readonly alg: Algorithm

	/**
	 * Lifetime of an access token in seconds.
	 */
	readonly at_expire_in: number

	/**
	 * Lifetime of a refresh token in seconds.
	 */
	readonly rt_expire_in: number

	/**
	 * Dedicated logger.
	 */
	readonly logger: TLogger
}

export type TTokenServiceStatic = {
	of: (strategy: TPersistenceStrategyToken, options: TTokenServiceOptions) => TTokenService
}

export type TTokenService = {
	verify: <$TType extends "access" | "refresh">(
		token: string,
		type: $TType,
	) => Oath<boolean, TRrr<"EINVAL">>

	get_payload: <$TType extends "access" | "refresh">(
		token: string,
		type: $TType,
	) => Oath<TOption<TAuthTokenPayload>, TRrr<"EINVAL" | "EIO">>

	decode: <$TType extends "access" | "refresh">(
		token: string,
		type: $TType,
	) => Oath<TOption<TAuthJWT>, TRrr<"EINVAL">>

	create: (params: {
		sub: SUB
		data: { lim: number; mfs: number; sbs: string; mxf: number }
		aud?: AUD
	}) => Oath<TAuthTokenPayload & { token: string }, TRrr<"EINVAL" | "EIO">>

	strategy: TPersistenceStrategyToken
}
