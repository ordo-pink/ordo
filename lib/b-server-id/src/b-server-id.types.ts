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
import type { ServerCore } from "@ordo-pink/b-server-core"

export type CodeStorage = Map<Core.User.Email, { hash: Server.Codegen.Hash; timestamp: Core.Timestamp.Instance }>

export type CodeLifetimeSeconds = number & {}

export type SessionLifetimeMinutes = number & {}

export type AllowedOrigin = `http${string}`

export type PartyMaker = Hunt.Instance<Prey>

export type Args = [
	logger: Core.Logger,
	user_repository: Server.User.Repository,
	code_lifetime_seconds: CodeLifetimeSeconds,
	session_lifetime_minutes: SessionLifetimeMinutes,
	email_strategy: Server.Email.Strategy,
	allowed_origins: AllowedOrigin[],
	codegen: Server.Codegen.Instance,
]

export type Prey = {
	auth: {
		requested: { args: [user: Core.User.Instance, code: Server.Codegen.Code] }
		signed_up: { args: void }
		logged_in: { args: void }
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

export type Env = ServerCore.Env & {
	partymaker: PartyMaker
	user_repository: Server.User.Repository
	codegen: Server.Codegen.Instance
	session_lifetime_minutes: SessionLifetimeMinutes
}

export type Instance = Routary.Instance<Env, ServerCore.Mut>

export type Create = (...args: Args) => Instance
