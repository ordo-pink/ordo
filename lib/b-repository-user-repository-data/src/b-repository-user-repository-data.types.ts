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
import type { Server } from "@ordo-pink/sdk-server"

export type Args = [
	repository_data: Server.Data.Repository,
	cache_user_id: Core.User.Id,
	cache_file_id: Core.Data.Id,
	user_file_id: Core.Data.Id,
]
export type Instance = Server.User.Repository

export type Create = (...args: Args) => Instance

export type Mapping<$Key extends string> = Record<$Key, Core.User.Id | undefined>

export type Cache = { email: Mapping<Core.User.Email>; ref: Mapping<Core.User.Ref> }
