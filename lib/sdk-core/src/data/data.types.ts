/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as DATA from "./data.constants"
import type * as Permission from "../permission/permission.types"
import type * as Timestamp from "../timestamp/timestamp.types"
import type * as User from "../user/user.types"
import type * as Uuid from "../uuid/uuid.types"
import type { GenericGuard } from "../sdk-core.types"

export type Id = Uuid.Instance
export type Name = string
export type Parent = Id | null
export type OwnerUserId = User.Id
export type OwnerGroupId = Uuid.Instance
export type CreatedAt = Timestamp.Instance
export type UpdatedAt = Timestamp.Instance
export type CreatedBy = User.Id
export type UpdatedBy = User.Id
export type LabelText = string
export type LabelColor = DATA.LABEL_COLOR
export type Label = [LabelText, LabelColor]
export type Labels = Label[]
export type Link = Id
export type Links = Link[]
export type Fields = Record<string, unknown>
export type Permissions = [user: Permission.Instance, group: Permission.Instance, other: Permission.Instance]
export type Location = DATA.LOCATION
export type Size = number

export type Instance = [
	id: Id,
	name: Name,
	parent: Parent,
	size: Size,
	owner: OwnerUserId,
	group: OwnerGroupId,
	created_at: CreatedAt,
	created_by: CreatedBy,
	updated_at: UpdatedAt,
	updated_by: UpdatedBy,
	labels: Labels,
	links: Links,
	fields: Fields,
	permissions: Permissions,
	location: Location,
]

export type FieldsGuard = GenericGuard<Fields>
export type Guard = GenericGuard<Instance>
export type LabelGuard = GenericGuard<Label>
export type LabelsGuard = GenericGuard<Labels>
export type LinksGuard = GenericGuard<Links>
export type LocationGuard = GenericGuard<Location>
export type NameGuard = GenericGuard<Name>
export type ParentGuard = GenericGuard<Parent>
export type PermissionsGuard = GenericGuard<Permissions>
export type SizeGuard = GenericGuard<Size>

export type CreateLabel = (text: LabelText, color?: LabelColor) => Label
export type Create = (
	name: Name,
	parent: Parent,
	size: Size,
	owner: OwnerUserId,
	author: CreatedBy,
	location?: Location,
	labels?: Labels,
	links?: Links,
	fields?: Fields,
	permissions?: Permissions,
) => Instance

export type GetCreatedAt = (data: Instance) => CreatedAt
export type GetCreatedBy = (data: Instance) => CreatedBy
export type GetFields = (data: Instance) => Fields
export type GetId = (data: Instance) => Id
export type GetLabels = (data: Instance) => Labels
export type GetLinks = (data: Instance) => Links
export type GetLocation = (data: Instance) => Location
export type GetName = (data: Instance) => Name
export type GetOwnerGroup = (data: Instance) => OwnerGroupId
export type GetOwnerUser = (data: Instance) => OwnerUserId
export type GetParent = (data: Instance) => Parent
export type GetPermissions = (data: Instance) => Permissions
export type GetSize = (data: Instance) => Size
export type GetUpdatedAt = (data: Instance) => UpdatedAt
export type GetUpdatedBy = (data: Instance) => UpdatedBy

export type SetFields = (value: Fields, data: Instance) => Instance
export type SetLabels = (value: Labels, data: Instance) => Instance
export type SetLinks = (value: Links, data: Instance) => Instance
export type SetLocation = (value: Location, data: Instance) => Instance
export type SetName = (value: Name, data: Instance) => Instance
export type SetOwnerGroup = (value: OwnerGroupId, data: Instance) => Instance
export type SetOwnerUser = (value: OwnerUserId, data: Instance) => Instance
export type SetParent = (value: Parent, data: Instance) => Instance
export type SetPermissions = (value: Permissions, data: Instance) => Instance
export type SetSize = (value: Size, data: Instance) => Instance
