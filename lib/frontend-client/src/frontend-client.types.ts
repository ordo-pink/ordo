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

import type { AuthResponse } from "@ordo-pink/backend-server-id"
import type { TLogger } from "@ordo-pink/logger"
import type { TOption } from "@ordo-pink/option"
import type { TResult } from "@ordo-pink/result"

export type TKnownFunction = {
	name: string
	fid: symbol
	permissions: Ordo.CreateFunction.Permissions
}

export type TInitCtx = {
	commands: Ordo.Command.Commands
	logger: TLogger
	known_functions: OrdoInternal.KnownFunctions
	APP_FID: symbol
	is_dev: boolean
	hosts: Ordo.Hosts
	activities$: Observable<Ordo.Activity.Instance[]>
	current_activity$: Observable<TOption<Ordo.Activity.Instance>>
	set_current_activity: (
		fid: symbol,
	) => (name: string) => TResult<void, Ordo.Rrr<"EPERM" | "ENOENT">>
	fetch: Ordo.Fetch
	auth$: Observable<TOption<AuthResponse>>
	user_query: Ordo.User.Query
	translate: Ordo.I18N.TranslateFn
	metadata_query: Ordo.Metadata.Query
	metadata_repository: Ordo.Metadata.Repository
}
