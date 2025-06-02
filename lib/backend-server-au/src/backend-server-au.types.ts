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

import type { Logger, Rrr, User } from "@ordo-pink/sdk-core"
import type { Oath } from "@ordo-pink/oath"
import type { Routary } from "@ordo-pink/routary"
import type { RoutaryOrdo } from "@ordo-pink/routary-ordo"
import type { Server } from "@ordo-pink/sdk-server"

/**
 * BackendAuth implements a backend for user authentication.
 */
export namespace BackendAuth {
	/** User authentication code. */
	export type Code = string

	/** Hashed user authentication code type alias. */
	export type CodeHash = string

	export type CodeStrategy = {
		hash: (code: BackendAuth.Code) => Oath.Instance<string, Rrr.Instance<"EIO">>
		generate: () => Oath.Instance<string, Rrr.Instance<"EIO">>
		verify: (hash: BackendAuth.CodeHash, code: BackendAuth.Code) => Oath.Instance<boolean, Rrr.Instance<"EIO">>
	}

	export type Storage = Map<User.Email, { hash: BackendAuth.CodeHash; timestamp: number }>

	export type Params = {
		allow_origin: string[]
		auth_storage: BackendAuth.Storage
		code_lifetime_ms: number
		code_strategy: BackendAuth.CodeStrategy
		create_request_id: () => string
		data_persistence_strategy: Server.Data.PersistenceStrategy
		defaults: { file_limit: number; max_upload_size: number; max_functions: number }
		email_strategy: Server.Notification.EmailStrategy
		logger: Logger
		port: number
		session_lifetime_s: number
		reference_mapping_user: Server.User.ReferenceMapping
		persistence_strategy_user: Server.User.PersistenceStrategy
	}

	export type Fuel = RoutaryOrdo.Fuel & Params

	export type Intake = Routary.Intake<BackendAuth.Fuel>
}
