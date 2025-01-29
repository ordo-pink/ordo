/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { EXP, JTI, SUB } from "@ordo-pink/wjwt"
import type { Oath } from "@ordo-pink/oath"

declare global {
	module OrdoBackend {
		module Tokens {
			export type TokenContent = { exp: EXP }

			/**
			 * A record of refresh token ids and tokens.
			 */
			export type TokenRecord = Record<JTI, TokenContent>

			/**
			 * Token persistence strategy implements approach to storing user tokens in the backend. Token
			 * persistence strategy is provided to `ID` service at start time and is then used for server side
			 * validation of incoming request authorisation tokens (JWT access tokens).
			 */
			export type PersistenceStrategy = {
				/**
				 * Returns refresh token of given `SUB` associated with given `JTI`.
				 *
				 * @param SUB - token subject
				 * @param JTI - token id
				 *
				 * @returns an Oath resolving into an option of the token or rejecting with `EIO`
				 */
				get_token: (sub: SUB, jti: JTI) => Oath<TokenContent, Ordo.Rrr<"EIO" | "ENOENT">>

				/**
				 * Returns a record of all refresh tokens associated with given `SUB`.
				 */
				get_token_record: (sub: SUB) => Oath<TokenRecord, Ordo.Rrr<"EIO" | "ENOENT">>

				/**
				 * Removes refresh token of given `SUB` associated with given `JTI`.
				 */
				remove_token: (sub: SUB, jti: JTI) => Oath<void, Ordo.Rrr<"EIO" | "ENOENT">>

				/**
				 * Removes a record of all refresh tokens associated with given `SUB`.
				 */
				remove_token_record: (sub: SUB) => Oath<void, Ordo.Rrr<"EIO" | "ENOENT">>

				/**
				 * Assigns refresh token of given `SUB` associated with given `JTI`.
				 */
				set_token: (sub: SUB, jti: JTI, content: TokenContent) => Oath<void, Ordo.Rrr<"EIO">>

				/**
				 * Assigns a record of all refresh tokens associated with given `SUB`.
				 */
				set_token_record: (sub: SUB, record: TokenRecord) => Oath<void, Ordo.Rrr<"EIO">>
			}
		}
	}
}
