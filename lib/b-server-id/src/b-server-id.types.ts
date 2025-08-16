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
import type { Hunt } from "@ordo-pink/oss-hunt"
import type { Routary } from "@ordo-pink/oss-routary"
import type { Server } from "@ordo-pink/sdk-server"
import type { ServerRoutary } from "@ordo-pink/sdk-server-routary"
import type { Wjwt } from "@ordo-pink/oss-wjwt"

export type CodeLifetimeSeconds = number & {}

export type SessionLifetimeMinutes = number & {}

export type AllowedOrigin = string

export type Hunt = Hunt.Instance<Prey>

export type Args = [
	logger: Core.Logger,
	user_repository: Server.User.Repository,
	code_lifetime_seconds: CodeLifetimeSeconds,
	session_lifetime_minutes: SessionLifetimeMinutes,
	email_strategy: Server.Email.Strategy,
	allowed_origins: AllowedOrigin | AllowedOrigin[],
	codegen_strategy: Server.Code.Codegen,
	wjwt: Wjwt.Instance,
]

export type Prey = {
	auth: {
		requested: { args: [email: Core.User.Email, code: Server.Code.Instance] }
		succeeded: { args: [email: Core.User.Email, ip: string] }
	}
	user: {
		update_requested: {
			email: { args: void }
			handle: { args: void }
		}
		update_completed: {
			email: { args: void }
			handle: { args: void }
		}
	}
}

export type Mut = ServerRoutary.Mut
export type Env = ServerRoutary.Env & {
	hunter: Hunt
	user_repository: Server.User.Repository
	code_service: Server.Code.Service
	session_lifetime_minutes: SessionLifetimeMinutes
	wjwt: Wjwt.Instance
}

export type Handler = Routary.Handler<Env, Mut>

export type Instance = Routary.Instance<Env, ServerRoutary.Mut>

export type Create = (...args: Args) => Instance
