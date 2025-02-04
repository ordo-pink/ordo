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
import type { TValidations } from "@ordo-pink/core"

declare global {
	module OrdoBackend {
		module Notification {
			type EmailStrategy = {
				send: (params: {
					from?: string
					to: string
					subject: string
					content: string
					cc?: string[]
					bcc?: string[]
					headers?: Record<string, string>
				}) => void
			}
		}

		module User {
			export type DTO = Ordo.User.Current.DTO & {
				email_code?: string
				password?: string
			}

			type PersistenceStrategy = {
				exists_by_id: (id: Ordo.User.ID) => Oath<boolean, Ordo.Rrr<"EIO">>
				exists_by_email: (email: Ordo.User.Email) => Oath<boolean, Ordo.Rrr<"EIO">>
				exists_by_handle: (handle: Ordo.User.Handle) => Oath<boolean, Ordo.Rrr<"EIO">>
				get_by_id: (id: Ordo.User.ID) => Oath<DTO, Ordo.Rrr<"EIO" | "ENOENT">>
				get_by_email: (email: Ordo.User.Email) => Oath<DTO, Ordo.Rrr<"EIO" | "ENOENT">>
				get_by_handle: (handle: Ordo.User.Handle) => Oath<DTO, Ordo.Rrr<"EIO" | "ENOENT">>
				create: (user: DTO) => Oath<DTO, Ordo.Rrr<"EIO" | "EEXIST">>
				update: (id: Ordo.User.ID, user: DTO) => Oath<DTO, Ordo.Rrr<"EIO" | "ENOENT" | "EINVAL">>
				remove: (id: Ordo.User.ID) => Oath<void, Ordo.Rrr<"EIO" | "ENOENT">>
			}

			export type Validations = TValidations<OrdoBackend.User.DTO>

			export type Static = {
				Validations: OrdoBackend.User.Validations
				Of: (dto: OrdoBackend.User.DTO) => OrdoBackend.User.Instance
				New: (email: Ordo.User.Email) => OrdoBackend.User.Instance
			}

			export type Instance = Ordo.User.Current.Instance & {
				validate_code: (code: string) => Oath<boolean, Ordo.Rrr<"EINVAL" | "ENOENT">>
				validate_password: (password: string) => Oath<boolean, Ordo.Rrr<"EINVAL" | "ENOENT">>
			}
		}

		module Token {
			export type Value = { exp: EXP }

			/**
			 * A record of refresh token ids and tokens.
			 */
			export type Dict = Record<JTI, Value>

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
				get_token: (sub: SUB, jti: JTI) => Oath<Value, Ordo.Rrr<"EIO" | "ENOENT">>

				/**
				 * Returns a dict of all refresh tokens associated with given `SUB`.
				 */
				get_token_dict: (sub: SUB) => Oath<Dict, Ordo.Rrr<"EIO" | "ENOENT">>

				/**
				 * Removes refresh token of given `SUB` associated with given `JTI`.
				 */
				remove_token: (sub: SUB, jti: JTI) => Oath<void, Ordo.Rrr<"EIO" | "ENOENT">>

				/**
				 * Removes a dict of all refresh tokens associated with given `SUB`.
				 */
				remove_token_dict: (sub: SUB) => Oath<void, Ordo.Rrr<"EIO" | "ENOENT">>

				/**
				 * Assigns refresh token of given `SUB` associated with given `JTI`.
				 */
				set_token: (sub: SUB, jti: JTI, content: Value) => Oath<void, Ordo.Rrr<"EIO">>

				/**
				 * Assigns a dict of all refresh tokens associated with given `SUB`.
				 */
				set_token_dict: (sub: SUB, record: Dict) => Oath<void, Ordo.Rrr<"EIO">>
			}
		}
	}
}
