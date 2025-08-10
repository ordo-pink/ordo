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
import type { Oath } from "@ordo-pink/oss-oath"

export type SessionId = Core.Uuid.Instance
export type Session = [id: SessionId, ...Core.Session.Instance]
export type Sessions = Session[]

type Replace<$Arr extends any[], $Type, $NewType> = $Arr extends [infer _This, ...infer _Rest]
	? _This extends $Type
		? [$NewType, ..._Rest]
		: [_This, ...Replace<_Rest, $Type, $NewType>]
	: never

export type Instance = Replace<Core.User.Instance, Core.User.Sessions, Sessions>

export type CreateArgs = [
	email: Core.User.Email,
	ref?: Core.User.Ref,
	name?: Core.User.Name,
	subscription?: Core.User.Subscription,
	installed_functions?: Core.User.InstalledFunctions,
	parent?: Core.User.Parent,
]

export type Create = (...args: CreateArgs) => Instance

export type Repository = {
	create: (user: Instance) => Oath.Instance<Instance, Core.Rrr.Instance<"EIO" | "EEXIST">>
	read: (id: Core.User.Id) => Oath.Instance<Instance, Core.Rrr.Instance<"EIO" | "ENOENT">>
	update: (id: Core.User.Id, dto: Instance) => Oath.Instance<Instance, Core.Rrr.Instance<"EIO" | "ENOENT">>
	delete: (id: Core.User.Id) => Oath.Instance<void, Core.Rrr.Instance<"EIO" | "ENOENT">>

	get_by_email: (email: Core.User.Email) => Oath.Instance<Instance, Core.Rrr.Instance<"EIO" | "ENOENT">>
	get_by_ref: (ref: Core.User.Ref) => Oath.Instance<Instance, Core.Rrr.Instance<"EIO" | "ENOENT">>
}

export type GetSessions = (user: Instance) => Sessions
export type HasSession = (session_id: SessionId, user: Instance) => boolean
export type GetSession = (session_id: SessionId, user: Instance) => Session | null
export type Serialize = (user: Instance) => Core.User.Instance
export type SerializeOther = (user: Instance) => Core.User.OtherUserInstance
export type SerializeSession = (session: Session) => Core.Session.Instance

export type ObfuscateEmail = (email: Core.User.Email) => Core.User.Email
