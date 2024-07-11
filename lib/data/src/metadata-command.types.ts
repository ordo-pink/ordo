import type { TResult } from "@ordo-pink/result"

import type { TCreateMetadataParams, TMetadata, TMetadataProps } from "./metadata.types"
import type { FSID } from "./data.types"
import type { TMetadataQuery } from "./metadata-query.types"
import type { TMetadataRepository } from "./metadata-repository.types"
import type { TRrr } from "./metadata.errors"
import type { TUserQuery } from "./user-query.types"

export type TMetadatCommandConstructor = (
	metadata_repository: TMetadataRepository,
	metadata_query: TMetadataQuery,
	user_query: TUserQuery,
) => TMetadataCommand
export type TMetadataCommandStatic = { of: TMetadatCommandConstructor }

export type TMetadataCommand = {
	create: (
		params: TCreateMetadataParams,
	) => TResult<void, TRrr<"EAGAIN" | "EEXIST" | "EINVAL" | "ENOENT">>

	replace: (value: TMetadata) => TResult<void, TRrr<"EAGAIN" | "ENOENT" | "EINVAL">>

	remove: (fsid: FSID) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	append_child: (
		fsid: FSID,
		child: FSID,
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT" | "EEXIST" | "ENXIO">>

	add_labels: (
		fsid: FSID,
		...labels: string[]
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	remove_labels: (
		fsid: FSID,
		...labels: string[]
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	replace_labels: (
		fsid: FSID,
		labels: string[],
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	set_size: (fsid: FSID, size: number) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	add_links: (fsid: FSID, ...links: FSID[]) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	remove_links: (
		fsid: FSID,
		...links: FSID[]
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	replace_links: (fsid: FSID, links: FSID[]) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	set_parent: (
		fsid: FSID,
		parent: FSID | null,
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT" | "ENXIO" | "EEXIST">>

	set_name: (
		fsid: FSID,
		name: string,
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT" | "EEXIST">>

	set_property: <_TProps_ extends TMetadataProps, __TKey__ extends keyof _TProps_>(
		fsid: FSID,
		key: __TKey__,
		value: _TProps_[__TKey__],
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	remove_property: <_TProps_ extends TMetadataProps, __TKey__ extends keyof _TProps_>(
		fsid: FSID,
		key: __TKey__,
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>
}
