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

import type { AUD, Algorithm, EXP, ISS, JTI, JWT, JWTPayload, SUB } from "@ordo-pink/wjwt"
import type { Oath } from "@ordo-pink/oath"
import type { TLogger } from "@ordo-pink/logger"
import type { TOption } from "@ordo-pink/option"
import type { TRrr } from "@ordo-pink/data"

// --- Public ---

/**
 * A record of refresh token ids and tokens.
 */
export type TTokenRecord = Record<JTI, string>

/**
 * Payload of the access JWT.
 *
 * lim: file_limit
 * mfs: max_file_size
 * sbs: subscription
 * mxf: max_functions
 */
export type TAccessTokenPayload = JWTPayload & {
	lim: number
	mfs: number
	sbs: string
	mxf: number
}

/**
 * Payload of the refresh JWT.
 */
export type TRefreshTokenPayload = TAccessTokenPayload

/**
 * Parsed access token content.
 */
export type TAccessJWT = JWT<TAccessTokenPayload>

/**
 * Parsed refresh token content.
 */
export type TRefreshJWT = JWT<TRefreshTokenPayload>

export type TPersistenceStrategyToken = {
	get_token: (sub: SUB, jti: JTI) => Oath<TOption<string>, TRrr<"EIO">>
	get_tokens: (sub: SUB) => Oath<TOption<TTokenRecord>, TRrr<"EIO">>
	remove_token: (sub: SUB, jti: JTI) => Oath<void, TRrr<"EIO" | "ENOENT">>
	remove_tokens: (sub: SUB) => Oath<void, TRrr<"EIO" | "ENOENT">>
	set_token: (sub: SUB, jti: JTI, token: string) => Oath<void, TRrr<"ENOENT" | "EIO">>
	set_tokens: (sub: SUB, map: TTokenRecord) => Oath<void, TRrr<"ENOENT" | "EIO">>
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

	readonly audience: AUD

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
	) => Oath<
		TOption<$TType extends "access" ? TAccessTokenPayload : TRefreshTokenPayload>,
		TRrr<"EINVAL" | "EIO">
	>

	decode: <$TType extends "access" | "refresh">(
		token: string,
		type: $TType,
	) => Oath<TOption<$TType extends "access" ? TAccessJWT : TRefreshJWT>, TRrr<"EINVAL">>

	create: (params: {
		sub: SUB
		data: { lim: number; mfs: number; sbs: string; mxf: number }
		prevJti?: JTI
		aud?: AUD
	}) => Oath<TAccessTokenPayload & { token: string }, TRrr<"EINVAL" | "ENOENT" | "EIO">>

	strategy: TPersistenceStrategyToken
}
