/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { CONSTANTS as PERMISSION } from "./permission.impl"
import { impl as fns } from "./fns.impl"
import { impl as timestamp } from "./timestamp.impl"
import { impl as uuid } from "./uuid.impl"
import { impl as validations } from "./validations.impl"

export namespace CONSTANTS {
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
}

export namespace impl {
	export const name_guard: Ordo.Data.NameGuard = (x): x is Ordo.Data.Name => validations.is_string(x)
	export const parent_guard: Ordo.Data.ParentGuard = (x): x is Ordo.Data.Parent => uuid.guard(x) || validations.is_null(x)

	export const create_label: Ordo.Data.CreateLabel = (text, color = CONSTANTS.LABEL_COLOR.DEFAULT) => ({ text, color })

	export const create: Ordo.Data.Create = (
		{
			name,
			id = uuid.create(),
			parent = null,
			size = 0,
			group = null,
			owner = null,
			location = CONSTANTS.LOCATION.LOCAL_AND_REMOTE,
			labels = [],
			links = [],
			fields = {},
			permissions = [PERMISSION.VALUE.SUWRX, PERMISSION.VALUE.__WRX, PERMISSION.VALUE.____X, PERMISSION.VALUE._____],
		},
		author,
	) => {
		const time = timestamp.create()
		const owned_by = owner ?? author

		return [
			id,
			name,
			parent,
			size,
			owned_by,
			group,
			time,
			author,
			time,
			author,
			labels,
			links,
			fields,
			permissions,
			location,
		] satisfies Ordo.Data.Instance
	}

	export const update: Ordo.Data.Update = fns.curry(
		({ fields, group, labels, links, location, name, owner, parent, permissions, size }, author, data) =>
			[
				data[0],
				name || data[1],
				parent !== void 0 ? parent : data[2],
				size ?? data[3],
				owner ?? data[4],
				group ?? data[5],
				data[6],
				data[7],
				timestamp.create(),
				author,
				labels ?? data[10],
				links ?? data[11],
				fields ?? data[12],
				permissions ?? data[13],
				location ?? data[14],
			] satisfies Ordo.Data.Instance,
	)

	export const has_id: Ordo.Data.HasId = fns.curry((id, data) => get_id(data) === id)

	export const get_id: Ordo.Data.GetId = fns.prop(0)
	export const get_name: Ordo.Data.GetName = fns.prop(1)
	export const get_parent: Ordo.Data.GetParent = fns.prop(2)
	export const get_size: Ordo.Data.GetSize = fns.prop(3)
	export const get_owner: Ordo.Data.GetOwnerUser = fns.prop(4)
	export const get_group: Ordo.Data.GetOwnerGroup = fns.prop(5)
	export const get_created_at: Ordo.Data.GetCreatedAt = fns.prop(6)
	export const get_created_by: Ordo.Data.GetCreatedBy = fns.prop(7)
	export const get_updated_at: Ordo.Data.GetUpdatedAt = fns.prop(8)
	export const get_updated_by: Ordo.Data.GetUpdatedBy = fns.prop(9)
	export const get_labels: Ordo.Data.GetLabels = fns.prop(10)
	export const get_links: Ordo.Data.GetLinks = fns.prop(11)
	export const get_fields: Ordo.Data.GetFields = fns.prop(12)
	export const get_permissions: Ordo.Data.GetPermissions = fns.prop(13)
	export const get_location: Ordo.Data.GetLocation = fns.prop(14)

	export const exists: Ordo.Data.Exists = fns.curry((new_item, vault) =>
		Object.values(vault).some(
			item =>
				get_id(item) === get_id(new_item) ||
				(get_name(item) === get_name(new_item) && get_parent(item) === get_parent(new_item)),
		),
	)

	export const has_link: Ordo.Data.HasLink = fns.curry((nl, d) => get_links(d).includes(nl))
	export const has_parent: Ordo.Data.HasParent = fns.curry((p, d) => get_parent(d) === p)
	export const has_name: Ordo.Data.HasName = fns.curry((n, d) => get_name(d) === n)
	export const has_label: Ordo.Data.HasLabel = fns.curry((nl, d) =>
		get_labels(d).some(l => l.color === nl.color && l.text === nl.text),
	)

	export const get_descendents: Ordo.Data.GetDescendents = fns.curry(
		(id: Ordo.Data.Id, vault: Ordo.Data.Vault, descendents: Ordo.Data.Instance[]) => {
			for (const item of Object.values(vault)) {
				if (!item) continue

				const item_parent = ordo.data.get_parent(item)

				if (item_parent === id) {
					const item_id = ordo.data.get_id(item)
					descendents.push(item)
					get_descendents(item_id, vault, descendents)
				}
			}

			return descendents
		},
	)

	export const get_children: Ordo.Data.GetChildren = fns.curry((parent, vault) =>
		Object.values(vault).filter(has_parent(parent)),
	)

	export const get_ancestors: Ordo.Data.GetAncestors = fns.curry((id, vault) => {
		const ancestors = [] as Ordo.Data.Instance[]
		if (!id) return ancestors

		let item = vault[id]
		let parent = item ? ordo.data.get_parent(item) : null

		while (parent !== null) {
			item = vault[parent]
			parent = item ? ordo.data.get_parent(item) : null
			ancestors.push(item)
		}

		return ancestors.toReversed()
	})
}

declare global {
	namespace Ordo.Data {
		type Id = Uuid.Instance
		type Name = string
		type Parent = Id | null
		type OwnerUserId = Uuid.Instance | null
		type OwnerGroupId = Uuid.Instance | null
		type CreatedAt = Timestamp.Instance
		type UpdatedAt = Timestamp.Instance
		type CreatedBy = Uuid.Instance | null
		type UpdatedBy = Uuid.Instance | null
		type LabelText = string
		type LabelColor = CONSTANTS.LABEL_COLOR
		type Label = { text: LabelText; color?: LabelColor }
		type Labels = Label[]
		type Link = Id
		type Links = Link[]
		type Fields = Record<string, unknown>
		type Permissions = [
			owner: Ordo.Permission.Instance,
			group: Ordo.Permission.Instance,
			f: Ordo.Permission.Instance,
			other: Ordo.Permission.Instance,
		]
		type Location = CONSTANTS.LOCATION
		type Size = number & {}
		type VaultId = Ordo.Data.Id

		type Instance = [
			id: Id,
			name: Name,
			parent: Parent,
			size: Size,
			owner_id: OwnerUserId,
			group_id: OwnerGroupId,
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

		type CreateParams = {
			name: Name
			id?: Id
			parent?: Parent
			size?: Size
			owner?: OwnerUserId
			group?: OwnerGroupId
			location?: Location
			labels?: Labels
			links?: Links
			fields?: Fields
			permissions?: Permissions
		}
		type Create = (params: CreateParams, created_by: CreatedBy) => Instance

		type UpdateParams = {
			name?: Name
			parent?: Parent
			size?: Size
			owner?: OwnerUserId
			group?: OwnerGroupId
			labels?: Labels
			links?: Links
			fields?: Fields
			permissions?: Permissions
			location?: Location
		}
		type Update = Ordo.Fns.Curried<(params: UpdateParams, author: UpdatedBy, data: Instance) => Instance>

		type HasId = Ordo.Fns.Curried<(id: Id, data: Instance) => boolean>
		type HasParent = Ordo.Fns.Curried<(parent: Parent, data: Instance) => boolean>
		type HasLabel = Ordo.Fns.Curried<(label: Label, data: Instance) => boolean>
		type HasLink = Ordo.Fns.Curried<(link: Link, data: Instance) => boolean>
		type HasName = Ordo.Fns.Curried<(name: Name, data: Instance) => boolean>

		type Exists = Ordo.Fns.Curried<(item: Instance, vault: Vault) => boolean>
		type GetDescendents = Ordo.Fns.Curried<(id: Id, vault: Vault, descendents: Instance[]) => Instance[]>
		type GetChildren = Ordo.Fns.Curried<(parent: Parent, vault: Vault) => Instance[]>
		type GetAncestors = Ordo.Fns.Curried<(id: Id, vault: Vault) => Instance[]>

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

		type Vault = Record<Ordo.Data.Id, Ordo.Data.Instance>
	}
}
