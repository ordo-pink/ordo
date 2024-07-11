import type { TOption } from "@ordo-pink/option"

import type { FSID, UserID } from "./data.types"
import { MetadataGuards } from "./metadata-validations"

export type TMetadataProps = Readonly<Record<string, any>>

export type TCreateMetadataParams<_TProps extends TMetadataProps = TMetadataProps> = Partial<
	Omit<
		TMetadataDTO<_TProps>,
		"created_by" | "created_at" | "size" | "updated_at" | "updated_by" | "fsid"
	>
> &
	Pick<TMetadataDTO<_TProps>, "name" | "parent"> & { author_id: UserID }

export type TMetadataStatic = {
	from: <_TProps extends TMetadataProps = TMetadataProps>(
		params: TCreateMetadataParams<_TProps>,
	) => TMetadata<_TProps>
	of: <_TProps extends TMetadataProps = TMetadataProps>(
		dto: TMetadataDTO<_TProps>,
	) => TMetadata<_TProps>
	guards: typeof MetadataGuards
}

export type TMetadataDTO<_TProps extends TMetadataProps = TMetadataProps> = Readonly<{
	fsid: FSID
	name: string
	parent: FSID | null
	links: FSID[]
	labels: string[]
	type: string
	created_at: number
	created_by: UserID
	updated_at: number
	updated_by: UserID
	size: number
	props?: _TProps
}>

export type TMetadata<_TProps extends TMetadataProps = TMetadataProps> = {
	get_fsid: () => FSID
	get_name: () => string
	get_parent: () => FSID | null
	is_root_child: () => boolean
	is_child_of: (parent: FSID) => boolean
	get_links: () => FSID[]
	has_links: () => boolean
	has_link_to: (link: FSID) => boolean
	get_labels: () => string[]
	has_labels: () => boolean
	has_label: (label: string) => boolean
	get_type: () => string
	get_created_at: () => Date
	get_created_by: () => UserID
	get_updated_at: () => Date
	get_updated_by: () => UserID
	get_size: () => number
	get_readable_size: () => string
	get_property: <_TKey_ extends keyof _TProps>(key: _TKey_) => TOption<NonNullable<_TProps[_TKey_]>>
	to_dto: () => TMetadataDTO<_TProps>
	is_hidden: () => boolean
}
