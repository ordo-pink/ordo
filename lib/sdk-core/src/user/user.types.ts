/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as Data from "../data/data.types"
import type * as Permission from "../permission/permission.types"
import type * as SemVer from "../sem-ver/semver.types"
import type * as Session from "../session/session.types"
import type * as Timestamp from "../timestamp/timestamp.types"
import type * as USER from "./user.constants"
import type * as Uuid from "../uuid/uuid.types"
import type { GenericGuard } from "../sdk-core.types"

export type Id = Uuid.Instance & {}
export type Ref = string & {}
export type Name = string & {}
export type Subscription = USER.SUBSCRIPTION
export type CreatedAt = Timestamp.Instance & {}
export type UpdatedAt = Timestamp.Instance & {}
export type Email = `${string}@${string}.${string}` & {}
export type InstalledFunctionName = `@${string}/${string}` & {}
export type InstalledFunction = `${InstalledFunctionName}:${SemVer.Instance}` & {}
export type InstalledFunctions = InstalledFunction[]
export type Parent = Id | null
export type Sessions = Session.Instance[]
export type CarbonCopy = Id & {}
export type CarbonCopies = CarbonCopy[]

export type OtherUserInstance = [id: Id, ref: Ref, name: Name, subscription: Subscription]
export type Instance = [
	...OtherUserInstance,
	created_at: CreatedAt,
	updated_at: UpdatedAt,
	email: Email,
	installed_functions: InstalledFunctions,
	sessions: Sessions,
	parent: Parent,
	cc: CarbonCopies,
]

export type CreateRef = (id: Id, email: Email) => Ref

export type Serialize = (user: Instance) => Instance
export type SerializeOtherUser = (user: OtherUserInstance) => OtherUserInstance

export type DefaultName = () => Name
export type DefaultSubscription = () => Subscription
export type DefaultParent = () => Parent
export type DefaultInstalledFunctions = () => InstalledFunctions

export type RefGuard = GenericGuard<Ref>
export type NameGuard = GenericGuard<Name>
export type SubscriptionGuard = GenericGuard<Subscription>
export type EmailGuard = GenericGuard<Email>
export type InstalledFunctionGuard = GenericGuard<InstalledFunction>

export type GetRef = (user: OtherUserInstance | Instance) => Ref
export type GetName = (user: OtherUserInstance | Instance) => Name
export type GetId = (user: OtherUserInstance | Instance) => Id
export type GetSubscription = (user: OtherUserInstance | Instance) => Subscription
export type GetCreatedAt = (user: Instance) => CreatedAt
export type GetUpdatedAt = (user: Instance) => UpdatedAt
export type GetEmail = (user: Instance) => Email
export type GetInstalledFunctions = (user: Instance) => InstalledFunctions
export type GetSessions = (user: Instance) => Sessions

export type HasTheName = (name: Name, user: OtherUserInstance | Instance) => boolean
export type HasTheId = (id: Id, user: OtherUserInstance | Instance) => boolean
export type HasTheRef = (ref: Ref, user: OtherUserInstance | Instance) => boolean
export type HasTheSubscription = (subscription: Subscription, user: OtherUserInstance | Instance) => boolean
export type HasTheEmail = (email: Email, user: Instance) => boolean

export type IsPaid = (user: OtherUserInstance | Instance) => boolean
export type IsFree = (user: OtherUserInstance | Instance) => boolean
export type HasName = (user: OtherUserInstance | Instance) => boolean
export type HasSessions = (user: Instance) => boolean
export type HasInstalledFunction = (f: InstalledFunction, user: Instance) => boolean
export type HasInstalledFunctions = (user: Instance) => boolean
export type CanDo = (action: Permission.Action, user: Instance, data: Data.Instance) => boolean
