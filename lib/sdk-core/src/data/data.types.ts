import type { Core } from "../sdk-core.types"
import type { User } from "./user.types"
import type { data } from "./data.impl"
import type { Identifiable } from "./mixins/identifiable/identifiable.types"
import type { Timestampable } from "./mixins/time-trackable/timestampable.types"
import type { Authored } from "./mixins/authored/authored.types"
import type { Transferable } from "../mixins/transferable.mixin"

export namespace Data {
	export type ID = Core.Model.Identifiable.ID

	export namespace Meta {
		export namespace Taggable {
			export type TagValue = string & {}
			export type Tag = [data.TAG_COLOR, TagValue]

			export type DTO = [tags: Tag[]]

			export type Instance = {
				get tags_length(): number
				get_tags_by_colors: (...colors: data.TAG_COLOR[]) => Tag[]
				get_tags: () => Tag[]
				has_tags: () => boolean
				has_every_tag: (...tags: Tag[]) => boolean
				has_no_tags: (...tags: Tag[]) => boolean
				has_some_tags: (...tags: Tag[]) => boolean
			}

			export type Validations = {
				is_tag_color: (x: any) => x is data.TAG_COLOR
				is_tag: (x: any) => x is Tag
			}

			export type Static = {
				create_tag: (value: TagValue, color?: data.TAG_COLOR) => Tag
			}
		}

		export namespace Accessible {
			export type Permissions = Record<User.ID, data.PERMISSION>

			export type DTO = [owner: User.ID, permissions: Permissions]

			export type Instance = {
				get_owner: () => User.ID
				can_read: (user: User.ID) => boolean
				can_write: (user: User.ID) => boolean
				can_exec: (user: User.ID) => boolean
				get_permissions: () => Permissions
				check_permissions: (permissions: Permissions) => boolean
			}

			export type Validations = {
				is_id: (x: any) => x is User.ID
				is_permission: (x: any) => x is data.PERMISSION
				is_permissions: (x: any) => x is Permissions
			}
		}

		export namespace Familiar {
			export type Name = string & {}
			export type Parent = Data.ID | null

			export type DTO = [name: Name, parent: Parent]

			export type Instance = {
				get_name: () => Name
				get_parent: () => Parent
				is_child_of: (parent: NonNullable<Parent>) => boolean
				is_root_child: () => boolean
			}

			export type Validations = {
				is_name: (x: any) => x is Name
				is_parent: (x: any) => x is Parent
			}
		}

		export namespace Linkable {
			export type Link = Data.ID

			export type DTO = [links: Link[]]

			export type Instance = {
				get links_length(): number
				get_links: () => Link[]
				has_links: () => boolean
				has_every_link: (...links: Link[]) => boolean
				has_no_links: (...links: Link[]) => boolean
				has_some_links: (...links: Link[]) => boolean
			}

			export type Validations = {
				is_links: (x: any) => x is Link[]
			}
		}

		export type DTO = [
			...Identifiable.DTO,
			...Timestampable.DTO<"with_updates">,
			...Authored.DTO<"with_updates">,
			...Accessible.DTO,
			...Familiar.DTO,
			...Taggable.DTO,
			...Linkable.DTO,
		]

		type IdentifiableInstance = Identifiable.Interface["Instance"]
		type TimestampableInstance = Timestampable.Interface<"with_updates">["Instance"]
		type AuthoredInstance = Authored.Interface<"with_updates">["Instance"]

		export type Instance = Core.Util.Prettify<
			IdentifiableInstance & TimestampableInstance & AuthoredInstance & Transferable.Instance<DTO> //&
			// Accessible.Instance &
			// Familiar.Instance &
			// Taggable.Instance &
			// Linkable.Instance
		>

		export type Validations = Core.Util.Prettify<
			Core.Model.Identifiable.Validations &
				Core.Model.TimeTrackable.Validations &
				Core.Model.AuthorTrackable.Validations &
				Accessible.Validations &
				Familiar.Validations &
				Taggable.Validations &
				Linkable.Validations &
				Core.Model.Transferable.Validations<DTO>
		>

		export type Static = Core.Model.Static<
			Core.Model.Identifiable.Static &
				Core.Model.TimeTrackable.Static &
				Taggable.Static &
				Core.Model.Transferable.Static<DTO, Instance>,
			Validations
		>
	}
	export namespace Content {}
}
