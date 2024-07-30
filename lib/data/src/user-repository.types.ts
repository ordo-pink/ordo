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

import type { BehaviorSubject, Observable } from "rxjs"

import type { Oath } from "@ordo-pink/oath"
import type { TOption } from "@ordo-pink/option"
import type { TResult } from "@ordo-pink/result"

import type { TRrr } from "./metadata.errors"
import { TFetch } from "@ordo-pink/core"

export type TCurrentUserRepository = {
	get: () => TResult<User.User, TRrr<"EAGAIN">>
	put: (user: User.User) => TResult<void, TRrr<"EPERM" | "EINVAL">>
	get version$(): Observable<number>
}

export type TCurrentUserRepositoryStatic = {
	of: (current_user$: BehaviorSubject<TOption<User.User>>) => TCurrentUserRepository
}

export type TAsyncCurrentUserRepository = {
	get: (token: string) => Oath<User.User, TRrr<"EIO" | "EPERM">>
	put: (token: string, user: User.User) => Oath<void, TRrr<"EINVAL" | "EIO" | "EPERM">>
}

export type TRemoteCurrentUserRepositoryStatic = {
	of: (id_host: string, fetch: TFetch) => TAsyncCurrentUserRepository
}

export type TKnownUsersRepository = {
	get: () => Oath<User.PublicUser[], TRrr<"EAGAIN">>
	put: (users: User.PublicUser[]) => Oath<void, TRrr<"EINVAL">>
	get version$(): Observable<number>
}

export type TKnownUserRepositoryStatic = {
	of: (known_user$: BehaviorSubject<User.PublicUser[]>) => TKnownUsersRepository
}
