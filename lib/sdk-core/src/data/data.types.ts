import type * as DATA from "./data.constants"
import type * as Permission from "../permission/permission.types"
import type * as Timestamp from "../timestamp/timestamp.types"
import type * as User from "../user/user.types"
import type * as Uuid from "../uuid/uuid.types"
import type { GenericGuard } from "../sdk-core.types"

export type Id = Uuid.Instance
export type Name = string
export type Parent = Id | null
export type OwnerUser = User.Id
export type OwnerGroup = Uuid.Instance
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
export type Permissions = [user: Permission.Instance, group: Permission.Instance]

export type Instance = [
	id: Id,
	name: Name,
	parent: Parent,
	owner: OwnerUser,
	group: OwnerGroup,
	created_at: CreatedAt,
	created_by: CreatedBy,
	updated_at: UpdatedAt,
	updated_by: UpdatedBy,
	labels: Labels,
	links: Links,
	fields: Fields,
	permissions: Permissions,
]

export type NameGuard = GenericGuard<Name>
export type ParentGuard = GenericGuard<Parent>
export type LabelGuard = GenericGuard<Label>
export type LabelsGuard = GenericGuard<Labels>
export type LinksGuard = GenericGuard<Links>
export type FieldsGuard = GenericGuard<Fields>
export type PermissionsGuard = GenericGuard<Permissions>
export type Guard = GenericGuard<Instance>

export type CreateLabel = (text: LabelText, color?: LabelColor) => Label
export type Create = (
	name: Name,
	parent: Parent,
	owner: OwnerUser,
	author: CreatedBy,
	labels?: Labels,
	links?: Links,
	fields?: Fields,
	permissions?: Permissions,
) => Instance

export type GetId = (data: Instance) => Id
export type GetName = (data: Instance) => Name
export type GetParent = (data: Instance) => Parent
export type GetOwnerUser = (data: Instance) => OwnerUser
export type GetOwnerGroup = (data: Instance) => OwnerGroup
export type GetCreatedAt = (data: Instance) => CreatedAt
export type GetUpdatedAt = (data: Instance) => UpdatedAt
export type GetCreatedBy = (data: Instance) => CreatedBy
export type GetUpdatedBy = (data: Instance) => UpdatedBy
export type GetLabels = (data: Instance) => Labels
export type GetLinks = (data: Instance) => Links
export type GetFields = (data: Instance) => Fields
export type GetPermissions = (data: Instance) => Permissions

export type SetName = (value: Name, data: Instance) => Instance
export type SetParent = (value: Parent, data: Instance) => Instance
export type SetOwnerUser = (value: OwnerUser, data: Instance) => Instance
export type SetOwnerGroup = (value: OwnerGroup, data: Instance) => Instance
export type SetLabels = (value: Labels, data: Instance) => Instance
export type SetLinks = (value: Links, data: Instance) => Instance
export type SetFields = (value: Fields, data: Instance) => Instance
export type SetPermissions = (value: Permissions, data: Instance) => Instance
