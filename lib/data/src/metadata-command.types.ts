import type { TResult } from "@ordo-pink/result"

import type { TCreateMetadataParams, TMetadata, TMetadataProps } from "./metadata.types"
import type { FSID } from "./data.types"
import type { RRR, TRrr } from "./metadata.errors"
import type { TMetadataQuery } from "./metadata-query.types"
import type { TUserQuery } from "./metadata-repository.types"

export type TMetadatCommandConstructor = (
	metadataQuery: TMetadataQuery,
	userQuery: TUserQuery,
) => TMetadataCommand
export type TMetadataCommandStatic = { of: TMetadatCommandConstructor }

export type TMetadataCommand = {
	create: (
		params: TCreateMetadataParams,
	) => TResult<void, TRrr<"EAGAIN" | "EEXIST" | "EINVAL" | "ENOENT">>

	replace: (value: TMetadata) => TResult<void, TRrr<"EAGAIN" | "ENOENT" | "EINVAL">>

	remove: (fsid: FSID) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	appendChild: (
		fsid: FSID,
		child: FSID,
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT" | "EEXIST" | "ENXIO">>

	addLabels: (
		fsid: FSID,
		...labels: string[]
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	removeLabels: (
		fsid: FSID,
		...labels: string[]
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	replaceLabels: (
		fsid: FSID,
		labels: string[],
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	setSize: (fsid: FSID, size: number) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	addLinks: (fsid: FSID, ...links: FSID[]) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	removeLinks: (fsid: FSID, ...links: FSID[]) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	replaceLinks: (fsid: FSID, links: FSID[]) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	setParent: (
		fsid: FSID,
		parent: FSID | null,
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT" | "ENXIO" | "EEXIST">>

	setName: (
		fsid: FSID,
		name: string,
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT" | "EEXIST">>

	setProperty: <_TProps_ extends TMetadataProps, __TKey__ extends keyof _TProps_>(
		fsid: FSID,
		key: __TKey__,
		value: _TProps_[__TKey__],
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	removeProperty: <_TProps_ extends TMetadataProps, __TKey__ extends keyof _TProps_>(
		fsid: FSID,
		key: __TKey__,
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>
}
