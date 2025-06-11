/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { CoreSDK } from "../core/core.types"
import type { DATA } from "./data.constants"
import type { CoreMixins } from "../mixins/mixins.types"
import type { User } from "../user/user.types"

export namespace Data {
	export type ID = CoreMixins.Identifiable.ID

	export type CreateParams = [
		name: CoreMixins.Named.Name,
		author: CoreMixins.Authored.AuthorID,
		parent?: CustomMixins.Childish.Parent,
		content_type?: CustomMixins.Contentful.ContentType,
		size?: CustomMixins.Contentful.Size,
		persistence_location?: CustomMixins.Persistable.Location,
		links?: CustomMixins.Linkable.Link[],
		tags?: CustomMixins.Taggable.Tag[],
		extensions?: CoreMixins.Extendable.Extensions,
		id?: CoreMixins.Identifiable.ID,
	]

	export type DTO = [
		...CoreMixins.Identifiable.DTO,
		...CoreMixins.Timestampable.DTO<"with_updates">,
		...CoreMixins.Authored.DTO<"with_updates">,
		...CoreMixins.Named.DTO,
		...Data.CustomMixins.Childish.DTO,
		...Data.CustomMixins.Contentful.DTO,
		...Data.CustomMixins.Persistable.DTO,
		...Data.CustomMixins.Linkable.DTO,
		...Data.CustomMixins.Taggable.DTO,
		...CoreMixins.Extendable.DTO,
		...Data.CustomMixins.Accessible.DTO,
	]

	export type DataInterface = CoreMixins.Authored.Interface<"with_updates"> &
		CoreMixins.Extendable.Interface &
		CoreMixins.Identifiable.Interface &
		CoreMixins.Named.Interface &
		CoreMixins.Timestampable.Interface<"with_updates"> &
		Data.CustomMixins.Accessible.Interface &
		Data.CustomMixins.Childish.Interface &
		Data.CustomMixins.Contentful.Interface &
		Data.CustomMixins.Linkable.Interface &
		Data.CustomMixins.Persistable.Interface &
		Data.CustomMixins.Taggable.Interface

	export type Interface = Data.DataInterface &
		CoreMixins.Serializable.Interface<Data.DTO, Data.DataInterface> &
		CoreMixins.Creatable.Interface<Data.CreateParams, Data.DataInterface>

	export type Instance = CoreSDK.Prettify<Interface["Instance"]>

	export type Static = CoreSDK.Prettify<Interface["Static"]>

	export namespace CustomMixins {
		export namespace Accessible {
			export type Permission = DATA.PERMISSION
			export type Permissions = Record<User.ID, Data.CustomMixins.Accessible.Permission>

			export type DTO = [owner: User.ID, permissions: Data.CustomMixins.Accessible.Permissions]

			export type Interface = {
				Instance: {
					get_owner: () => User.ID
					can_read: (user: User.ID) => boolean
					can_write: (user: User.ID) => boolean
					can_exec: (user: User.ID) => boolean
					get_permissions: () => Data.CustomMixins.Accessible.Permissions
				}
				Plain: { owner: User.ID; permissions: Data.CustomMixins.Accessible.Permissions }
				Static: {
					PERMISSION: typeof DATA.PERMISSION
					get_default_permission: () => Data.CustomMixins.Accessible.Permission
					get_default_permissions: () => Data.CustomMixins.Accessible.Permissions
				}
				Validations: {
					is_id: (x: any) => x is User.ID
					is_permission: (x: any) => x is Data.CustomMixins.Accessible.Permission
					is_permissions: (x: any) => x is Data.CustomMixins.Accessible.Permissions
				}
			}
		}

		export namespace Childish {
			export type Parent = Data.ID | null

			export type DTO = [parent: Data.CustomMixins.Childish.Parent]

			export type Interface = {
				Instance: {
					get_parent: () => Data.CustomMixins.Childish.Parent
					is_child_of: (parent: NonNullable<Data.CustomMixins.Childish.Parent>) => boolean
					is_root_child: () => boolean
				}
				Plain: { parent: Data.CustomMixins.Childish.Parent }
				Static: {}
				Validations: CoreMixins.Identifiable.Interface["Validations"] & {
					is_parent: (x: any) => x is Data.CustomMixins.Childish.Parent
				}
			}
		}

		export namespace Contentful {
			export type Size = number & {}
			export type ContentType = string & {}

			export type DTO = [type: Data.CustomMixins.Contentful.ContentType, size: Data.CustomMixins.Contentful.Size]

			export type Interface = {
				Instance: {
					get_content_type: () => Data.CustomMixins.Contentful.ContentType
					has_content_type: (content_type: Data.CustomMixins.Contentful.ContentType) => boolean
					get_size: () => number
					get_readable_size: () => string
				}
				Plain: { type: Data.CustomMixins.Contentful.ContentType; size: Data.CustomMixins.Contentful.Size }
				Static: {
					get_default_content_type: () => Data.CustomMixins.Contentful.ContentType
					get_default_size: () => Data.CustomMixins.Contentful.Size
					to_readable_size: (size: Data.CustomMixins.Contentful.Size) => string
				}
				Validations: {
					is_size: (x: any) => x is Data.CustomMixins.Contentful.Size
					is_content_type: (x: any) => x is Data.CustomMixins.Contentful.ContentType
				}
			}
		}

		export namespace Linkable {
			export type Link = Data.ID

			export type DTO = [links: Data.CustomMixins.Linkable.Link[]]

			export type Interface = {
				Instance: {
					get links_length(): number
					get_links: () => Data.CustomMixins.Linkable.Link[]
					has_links: () => boolean
					has_every_link: (...links: Data.CustomMixins.Linkable.Link[]) => boolean
					has_no_links: (...links: Data.CustomMixins.Linkable.Link[]) => boolean
					has_some_links: (...links: Data.CustomMixins.Linkable.Link[]) => boolean
				}
				Plain: { links: Data.CustomMixins.Linkable.Link[] }
				Static: {
					get_default_links: () => Data.CustomMixins.Linkable.Link[]
				}
				Validations: CoreMixins.Identifiable.Interface["Validations"] & {
					is_links: (x: any) => x is Data.CustomMixins.Linkable.Link[]
				}
			}
		}

		export namespace Persistable {
			export type Location = DATA.PERSISTENCE_LOCATION

			export type DTO = [persistence_location: Data.CustomMixins.Persistable.Location]

			export type Interface = {
				Instance: {
					get_persistence_location: () => Data.CustomMixins.Persistable.Location
					should_persist_remotely: () => boolean
					should_persist_locally: () => boolean
				}
				Plain: { persistence_location: Data.CustomMixins.Persistable.Location }
				Static: {
					PERSISTENCE_LOCATION: typeof DATA.PERSISTENCE_LOCATION
					get_default_persistence_location: () => Data.CustomMixins.Persistable.Location
				}
				Validations: {
					is_persistence_location: (x: any) => x is Data.CustomMixins.Persistable.Location
				}
			}
		}

		export namespace Taggable {
			export type TagValue = string & {}
			export type TagColor = DATA.TAG_COLOR
			export type Tag = [Data.CustomMixins.Taggable.TagColor, Data.CustomMixins.Taggable.TagValue]

			export type DTO = [tags: Tag[]]

			export type Interface = {
				Instance: {
					get tags_length(): number
					get_tags_by_colors: (...colors: DATA.TAG_COLOR[]) => Data.CustomMixins.Taggable.Tag[]
					get_tags: () => Data.CustomMixins.Taggable.Tag[]
					has_tags: () => boolean
					has_every_tag: (...tags: Data.CustomMixins.Taggable.Tag[]) => boolean
					has_none_of_tags: (...tags: Data.CustomMixins.Taggable.Tag[]) => boolean
					has_some_tags: (...tags: Data.CustomMixins.Taggable.Tag[]) => boolean
				}
				Plain: { tags: Data.CustomMixins.Taggable.Tag[] }
				Static: {
					DEFAULT_TAG_COLOR: Data.CustomMixins.Taggable.TagColor
					create_tag: (value: Data.CustomMixins.Taggable.TagValue, color?: Data.CustomMixins.Taggable.TagColor) => Tag
				}
				Validations: {
					is_tag_color: (x: any) => x is Data.CustomMixins.Taggable.TagColor
					is_tag: (x: any) => x is Data.CustomMixins.Taggable.Tag
				}
			}
		}
	}
}

export namespace Content {
	export type Parser = "text" | "json" | "array-buffer" | "stream" | "form-data" | "bytes" | "omit"
}

/*
namespace Content {
	type Instance = ArrayBuffer | ArrayBufferLike | ReadableStream | null

	type PersistenceStrategy = {
		clear: () => Oath.Instance<void, Ordo.Rrr<"EIO">>
		delete: (uid: Ordo.User.UID, fsid: Ordo.Metadata.FSID) => Oath.Instance<void, Ordo.Rrr<"ENOENT" | "EIO">>
		exists: (uid: Ordo.User.UID, fsid: Ordo.Metadata.FSID) => Oath.Instance<boolean, Ordo.Rrr<"EIO">>
		get: (uid: Ordo.User.UID, fsid: Ordo.Metadata.FSID) => Oath.Instance<Ordo.Content.Instance, Ordo.Rrr<"ENOENT" | "EIO">>
		list: () => Oath.Instance<Record<string, any>, Ordo.Rrr<"EIO">>
		put: (
			uid: Ordo.User.UID,
			fsid: Ordo.Metadata.FSID,
			content: Ordo.Content.Instance,
		) => Oath.Instance<void, Ordo.Rrr<"EIO">>
	}

	type RepositoryStatic = {
		Of: (
			auth$: Zags.Instance<{ user: Ordo.User.Current.Instance | null }>,
			local_strategy: Ordo.Content.PersistenceStrategy,
			remote_strategy: Ordo.Content.PersistenceStrategy,
		) => Repository
	}

	type Repository = {
		get: (
			uid: Ordo.User.UID | null,
			fsid: Ordo.Metadata.FSID,
		) => Oath.Instance<Ordo.Content.Instance, Ordo.Rrr<"EIO" | "EACCES" | "EINVAL">>
		get_all: () => Oath.Instance<Record<string, Ordo.Content.Instance>, Ordo.Rrr<"EIO">>
		put: (
			uid: Ordo.User.UID | null,
			fsid: Ordo.Metadata.FSID,
			content: Ordo.Content.Instance,
		) => Oath.Instance<void, Ordo.Rrr<"EINVAL" | "EACCES" | "EIO">>
		remove: (
			uid: Ordo.User.UID | null,
			fsid: Ordo.Metadata.FSID,
		) => Oath.Instance<void, Ordo.Rrr<"EINVAL" | "ENOENT" | "EACCES" | "EIO">>
		get $(): Zags.Instance<{ version: number }>
	}

	type QueryStatic = {
		Of: (
			repository: Ordo.Content.Repository,
			check_query_permission: (permission: Ordo.CreateFunction.QueryPermission) => TResult<void, Ordo.Rrr<"EPERM">>,
		) => Ordo.Content.Query
	}

	type Query = {
		get: (
			uid: Ordo.User.UID,
			fsid: Ordo.Metadata.FSID,
		) => Oath.Instance<Ordo.Content.Instance, Ordo.Rrr<"EPERM" | "EIO" | "EACCES" | "EINVAL" | "ENOENT">>
	}
}

namespace Metadata {
	type FSID = `${string}-${string}-${string}-${string}-${string}`
	type Props = Readonly<Record<string, any>>

	type CreateParams<$TProps extends Ordo.Metadata.Props = Ordo.Metadata.Props> = Partial<
		Omit<Ordo.Metadata.DTO<$TProps>, "created_by" | "created_at" | "updated_at" | "updated_by" | "fsid">
	> &
		Pick<Ordo.Metadata.DTO<$TProps>, "name" | "parent">

	type DTO<$TProps extends Ordo.Metadata.Props = Ordo.Metadata.Props> = {
		fsid: Ordo.Metadata.FSID
		name: string
		parent: Ordo.Metadata.FSID | null
		links: Ordo.Metadata.FSID[]
		labels: Ordo.Metadata.Label[]
		type: string
		created_at: number
		created_by: Ordo.User.UID | null
		updated_at: number
		updated_by: Ordo.User.UID | null
		size: number
		props?: $TProps
		is_deleted?: boolean
		checksum?: string
	}

	type Static = {
		Of: <$TProps extends Ordo.Metadata.Props = Ordo.Metadata.Props>(
			params: Ordo.Metadata.CreateParams<$TProps> & { author_id: Ordo.User.UID | null },
		) => Ordo.Metadata.Instance<$TProps>
		FromDTO: <$TProps extends Ordo.Metadata.Props = Ordo.Metadata.Props>(
			dto: Ordo.Metadata.DTO<$TProps>,
		) => Ordo.Metadata.Instance<$TProps>
		Validations: Ordo.Metadata.Validations
	}

	type Instance<$TProps extends Ordo.Metadata.Props = Ordo.Metadata.Props> = {
		get_fsid: () => Ordo.Metadata.FSID
		get_name: () => string
		get_parent: () => Ordo.Metadata.FSID | null
		is_root_child: () => boolean
		is_child_of: (parent: Ordo.Metadata.FSID) => boolean
		get_links: () => Ordo.Metadata.FSID[]
		has_links: () => boolean
		has_link_to: (link: Ordo.Metadata.FSID) => boolean
		get_labels: () => Ordo.Metadata.Label[]
		has_labels: () => boolean
		has_label: (label: Ordo.Metadata.Label) => boolean
		get_label_index: (label: Ordo.Metadata.Label) => number
		get_type: () => string
		get_created_at: () => Date
		get_created_by: () => Ordo.User.UID | null
		get_updated_at: () => Date
		get_updated_by: () => Ordo.User.UID | null
		get_size: () => number
		get_readable_size: () => string
		get_property: <_TKey extends keyof $TProps>(key: _TKey) => NonNullable<$TProps[_TKey]> | null
		to_dto: () => Ordo.Metadata.DTO<$TProps>
		equals: (other_metadata?: Ordo.Metadata.Instance) => boolean
		is_item_of: (dto: Ordo.Metadata.DTO) => boolean
		is_hidden: () => boolean
		validate: (checksum: string) => boolean
		is_deleted: () => boolean
		is_local_only: () => boolean
	}

	type Validations = TValidations<Ordo.Metadata.DTO> & {
		is_metadata: (x: unknown) => x is Ordo.Metadata.Instance
		is_metadata_dto: (x: unknown) => x is Ordo.Metadata.DTO
		is_label: (x: unknown) => x is Ordo.Metadata.Label
		is_link: (x: unknown) => x is Ordo.Metadata.FSID
		is_prop_key: (x: unknown) => boolean
		are_labels: (x: unknown) => boolean
		are_links: (x: unknown) => boolean
	}

	type Label = { name: string; color: C.LABEL_COLOR }

	type RepositoryStatic = {
		Of: (metadata$: Zags.Instance<{ items: Ordo.Metadata.Instance[] | null }>) => Repository
	}

	type Repository = {
		get: () => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EPERM" | "EAGAIN">>
		put: (metadata: Ordo.Metadata.Instance[]) => TResult<void, Ordo.Rrr<"EINVAL">>
		get $(): Zags.Instance<{ version: number }>
	}

	type RepositoryAsyncStatic = {
		Of: (data_host: string, fetch: Ordo.Fetch) => RepositoryAsync
	}

	type RepositoryAsync = {
		get: () => Oath.Instance<Ordo.Metadata.DTO[], Ordo.Rrr<"EIO">>
		put: (metadata: Ordo.Metadata.DTO[]) => Oath.Instance<void, Ordo.Rrr<"EINVAL" | "EIO">>
	}

	type QueryOptions = { show_hidden?: boolean }

	type QueryStatic = {
		Of: (
			repository: Ordo.Metadata.Repository,
			check_query_permission: (permission: Ordo.CreateFunction.QueryPermission) => TResult<void, Ordo.Rrr<"EPERM">>,
		) => Query
	}

	type Query = {
		get $(): Zags.Instance<{ version: number }>

		get: (options?: QueryOptions) => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EPERM" | "EAGAIN">>

		get_by_fsid: (
			fsid: FSID,
			options?: QueryOptions,
		) => TResult<Ordo.Metadata.Instance | null, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL">>

		total: (options?: QueryOptions) => TResult<number, Ordo.Rrr<"EPERM" | "EAGAIN">>

		get_by_name: (
			name: string,
			parent: FSID | null,
			options?: QueryOptions,
		) => TResult<Ordo.Metadata.Instance | null, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL">>

		get_by_labels: (
			labels: Ordo.Metadata.Label[],
			options?: QueryOptions,
		) => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL">>

		has_incoming_links: (
			fsid: FSID,
			options?: QueryOptions,
		) => TResult<boolean, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

		get_incoming_links: (
			fsid: FSID,
			options?: QueryOptions,
		) => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

		get_outgoing_links: (
			fsid: FSID,
			options?: QueryOptions,
		) => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

		get_parent: (
			fsid: FSID,
			options?: QueryOptions,
		) => TResult<Ordo.Metadata.Instance | null, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

		get_ancestors: (
			fsid: FSID,
			options?: QueryOptions,
		) => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

		has_ancestor: (
			fsid: FSID,
			ancestor: FSID,
			options?: QueryOptions,
		) => TResult<boolean, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

		has_child: (
			fsid: FSID,
			child: FSID,
			options?: QueryOptions,
		) => TResult<boolean, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

		has_children: (fsid: FSID, options?: QueryOptions) => TResult<boolean, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

		get_children: (
			fsid: FSID | null,
			options?: QueryOptions,
		) => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

		has_descendent: (
			fsid: FSID,
			descendent: FSID,
			options?: QueryOptions,
		) => TResult<boolean, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

		has_descendents: (
			fsid: FSID,
			options?: QueryOptions,
		) => TResult<boolean, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

		get_descendents: (
			fsid: FSID,
			options?: QueryOptions,
			accumulator?: Ordo.Metadata.Instance[],
		) => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

		// TODO: toTree: (source: TFSID | null) => typeof source extends null ? Ordo.Metadata.ItemBranch[] : Ordo.Metadata.ItemBranch

		// TODO: toGraph: (
		// 	source: TFSID | null,
		// ) => typeof source extends null ? Ordo.Metadata.ItemBranchWithLinks[] : Ordo.Metadata.ItemBranchWithLinks
	}

	type CommandStatic = {
		Of: (
			metadata_repository: Ordo.Metadata.Repository,
			metadata_query: Ordo.Metadata.Query,
			user_query: Ordo.User.Query,
		) => Ordo.Metadata.Command
	}

	type Command = {
		create: (
			params: Ordo.Metadata.CreateParams,
		) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EEXIST" | "EINVAL" | "ENOENT">>

		replace: (value: Ordo.Metadata.Instance) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "ENOENT" | "EINVAL">>

		remove: (fsid: Ordo.Metadata.FSID) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

		append_child: (
			fsid: Ordo.Metadata.FSID,
			child: Ordo.Metadata.FSID,
		) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT" | "EEXIST" | "ENXIO">>

		add_labels: (
			fsid: Ordo.Metadata.FSID,
			...labels: Ordo.Metadata.Label[]
		) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

		remove_labels: (
			fsid: Ordo.Metadata.FSID,
			...labels: Ordo.Metadata.Label[]
		) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

		update_label: (
			old_label: Ordo.Metadata.Label,
			new_label: Ordo.Metadata.Label,
		) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

		replace_labels: (
			fsid: Ordo.Metadata.FSID,
			labels: Ordo.Metadata.Label[],
		) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

		set_size: (fsid: Ordo.Metadata.FSID, size: number) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

		add_links: (
			fsid: Ordo.Metadata.FSID,
			...links: Ordo.Metadata.FSID[]
		) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

		remove_links: (
			fsid: Ordo.Metadata.FSID,
			...links: Ordo.Metadata.FSID[]
		) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

		replace_links: (
			fsid: Ordo.Metadata.FSID,
			links: Ordo.Metadata.FSID[],
		) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

		set_parent: (
			fsid: Ordo.Metadata.FSID,
			parent: Ordo.Metadata.FSID | null,
		) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT" | "ENXIO" | "EEXIST">>

		set_name: (
			fsid: Ordo.Metadata.FSID,
			name: string,
		) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT" | "EEXIST">>

		set_property: <$TProps extends Ordo.Metadata.Props, $TKey extends keyof $TProps>(
			fsid: Ordo.Metadata.FSID,
			key: $TKey,
			value: $TProps[$TKey],
		) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

		remove_property: <$TProps extends Ordo.Metadata.Props, $TKey extends keyof $TProps>(
			fsid: Ordo.Metadata.FSID,
			key: $TKey,
		) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>
	}
}
*/
