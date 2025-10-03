/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import * as uuid from "./uuid.impl"
import * as validations from "./validations.impl"

// --- Constants ---

export enum LABEL_COLOR {
	DEFAULT,
	AMBER,
	BLUE,
	CYAN,
	EMERALD,
	FUSCHSIA,
	GRAY,
	GREEN,
	INDIGO,
	LIME,
	ORANGE,
	PINK,
	PURPLE,
	RED,
	ROSE,
	SKY,
	TEAL,
	VIOLET,
	YELLOW,
	length,
}

export enum LOCATION {
	LOCAL_AND_REMOTE,
	LOCAL_ONLY,
	REMOTE_ONLY,
}

// --- Impl ---

export const name_guard: Ordo.Data.NameGuard = (x): x is Ordo.Data.Name => validations.is_string(x)
export const parent_guard: Ordo.Data.ParentGuard = (x): x is Ordo.Data.Parent => uuid.guard(x) || validations.is_null(x)

export const create_label: Ordo.Data.CreateLabel = (t, c = LABEL_COLOR.DEFAULT) => [t, c]

// --- Types ---

declare global {
	namespace Ordo.Data {
		type Id = Uuid.Instance
		type Name = string
		type Parent = Id | null
		type OwnerUserId = Uuid.Instance
		type OwnerGroupId = Uuid.Instance
		type CreatedAt = Timestamp.Instance
		type UpdatedAt = Timestamp.Instance
		type CreatedBy = Uuid.Instance
		type UpdatedBy = Uuid.Instance
		type LabelText = string
		type LabelColor = LABEL_COLOR
		type Label = [LabelText, LabelColor]
		type Labels = Label[]
		type Link = Id
		type Links = Link[]
		type Fields = Record<string, unknown>
		type Permissions = [user: Ordo.Permission.Instance, group: Ordo.Permission.Instance, other: Ordo.Permission.Instance]
		type Location = LOCATION
		type Size = number & {}
		type Content = ReadableStream & {}

		type Instance = [
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

		type FieldsGuard = GenericGuard<Fields>
		type Guard = GenericGuard<Instance>
		type LabelGuard = GenericGuard<Label>
		type LabelsGuard = GenericGuard<Labels>
		type LinksGuard = GenericGuard<Links>
		type LocationGuard = GenericGuard<Location>
		type NameGuard = GenericGuard<Name>
		type ParentGuard = GenericGuard<Parent>
		type PermissionsGuard = GenericGuard<Permissions>
		type SizeGuard = GenericGuard<Size>

		type CreateLabel = (text: LabelText, color?: LabelColor) => Label

		type Create = (
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

		type GetCreatedAt = (data: Instance) => CreatedAt
		type GetCreatedBy = (data: Instance) => CreatedBy
		type GetFields = (data: Instance) => Fields
		type GetId = (data: Instance) => Id
		type GetLabels = (data: Instance) => Labels
		type GetLinks = (data: Instance) => Links
		type GetLocation = (data: Instance) => Location
		type GetName = (data: Instance) => Name
		type GetOwnerGroup = (data: Instance) => OwnerGroupId
		type GetOwnerUser = (data: Instance) => OwnerUserId
		type GetParent = (data: Instance) => Parent
		type GetPermissions = (data: Instance) => Permissions
		type GetSize = (data: Instance) => Size
		type GetUpdatedAt = (data: Instance) => UpdatedAt
		type GetUpdatedBy = (data: Instance) => UpdatedBy

		type SetFields = Ordo.Fns.Curried<(value: Fields, data: Instance) => Instance>
		type SetLabels = Ordo.Fns.Curried<(value: Labels, data: Instance) => Instance>
		type SetLinks = Ordo.Fns.Curried<(value: Links, data: Instance) => Instance>
		type SetLocation = Ordo.Fns.Curried<(value: Location, data: Instance) => Instance>
		type SetName = Ordo.Fns.Curried<(value: Name, data: Instance) => Instance>
		type SetOwnerGroup = Ordo.Fns.Curried<(value: OwnerGroupId, data: Instance) => Instance>
		type SetOwnerUser = Ordo.Fns.Curried<(value: OwnerUserId, data: Instance) => Instance>
		type SetParent = Ordo.Fns.Curried<(value: Parent, data: Instance) => Instance>
		type SetPermissions = Ordo.Fns.Curried<(value: Permissions, data: Instance) => Instance>
		type SetSize = Ordo.Fns.Curried<(value: Size, data: Instance) => Instance>
	}
}
