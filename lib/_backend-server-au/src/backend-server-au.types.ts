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

import type { Core } from "@ordo-pink/sdk-core"
import type { Routary } from "@ordo-pink/oss-routary"
import type { RoutaryOrdo } from "@ordo-pink/sdk-server-routary"
import type { Server } from "@ordo-pink/sdk-server"

export type Code = string & {}

export type CodeHash = string & {}

export type CodeStorage = Map<Core.User.Email, { hash: CodeHash; timestamp: number }>

export type Args = [
	allow_origin: string[],
	code_lifetime_ms: number,
	code_strategy: Server.Code.Codegen,
	data_repository: Server.Data.Repository,
	email_strategy: Server.Email.Strategy,
	logger: Core.Logger,
	session_lifetime_seconds: number,
	user_repository: Server.User.Repository,
]

export type Instance = ReturnType<Routary.Instance<Fuel>["start"]>

export type Create = (...args: Args) => Instance

export type Fuel = Core.Prettify<
	RoutaryOrdo.Fuel & {
		data_repository: Server.Data.Repository
		email_strategy: Server.Email.Strategy
		session_lifetime_seconds: number
		user_repository: Server.User.Repository
		code_strategy: Server.Code.Codegen
		code_storage: CodeStorage
	}
>

export type Intake = Core.Prettify<Routary.Intake<Fuel>>
