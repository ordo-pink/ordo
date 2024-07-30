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

import type { Observable } from "rxjs"

import type { TFetch, THosts, TKnownFunctions, TPermissions, TRequireFID } from "@ordo-pink/core"
import type { TRrr, TUserQuery } from "@ordo-pink/data"
import type { AuthResponse } from "@ordo-pink/backend-server-id"
import type { TLogger } from "@ordo-pink/logger"
import type { TOption } from "@ordo-pink/option"
import type { TResult } from "@ordo-pink/result"

export type TKnownFunction = {
	name: string
	fid: symbol
	permissions: TPermissions
}

export type TInitCtx = {
	commands: Client.Commands.Commands
	logger: TLogger
	known_functions: TKnownFunctions
	APP_FID: symbol
	is_dev: boolean
	hosts: THosts
	activities$: Observable<Functions.Activity[]>
	current_activity$: Observable<TOption<Functions.Activity>>
	set_current_activity: TRequireFID<(name: string) => TResult<void, TRrr<"EPERM" | "ENOENT">>>
	fetch: TFetch
	auth$: Observable<TOption<AuthResponse>>
	user_query: TUserQuery
}
