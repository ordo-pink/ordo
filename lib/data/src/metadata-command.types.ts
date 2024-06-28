import type { TCreateMetadataParams, TMetadata, TMetadataProps } from "./metadata.types"
import type { FSID } from "./data.types"
import type { RRR } from "./metadata.errors"
import type { TMetadataQuery } from "./metadata-query.types"
import type { TResult } from "@ordo-pink/result"
import type { TUserQuery } from "./metadata-repository.types"

export type TMetadatCommandConstructor = (
	query: TMetadataQuery,
	user: TUserQuery,
) => TMetadataCommand
export type TMetadataCommandStatic = { of: TMetadatCommandConstructor }

export type TMetadataCommand = {
	write: (metadata: TMetadata[]) => void

	create: (
		params: TCreateMetadataParams,
	) => TResult<
		void,
		| RRR.USERS_NOT_LOADED
		| RRR.METADATA_NOT_LOADED
		| RRR.FSID_ALREADY_TAKEN
		| RRR.INVALID_NAME
		| RRR.INVALID_PARENT
		| RRR.NAME_PARENT_TAKEN
		| RRR.INVALID_LABEL
		| RRR.INVALID_LINK
		| RRR.PARENT_NOT_FOUND
		| RRR.INVALID_TYPE
		| RRR.INVALID_PROPS
	>

	replace: (
		value: TMetadata,
	) => TResult<void, RRR.METADATA_NOT_LOADED | RRR.METADATA_NOT_FOUND | RRR.USERS_NOT_LOADED>

	remove: (
		fsid: FSID,
	) => TResult<
		void,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.USERS_NOT_LOADED
	>

	appendChild: (
		fsid: FSID,
		child: FSID,
	) => TResult<
		void,
		| RRR.METADATA_NOT_LOADED
		| RRR.INVALID_FSID
		| RRR.METADATA_NOT_FOUND
		| RRR.FSID_NOT_FOUND
		| RRR.NAME_PARENT_TAKEN
		| RRR.INVALID_PARENT
		| RRR.CIRCULAR_PARENT_REFERENCE
		| RRR.USERS_NOT_LOADED
	>

	addLabels: (
		fsid: FSID,
		...labels: string[]
	) => TResult<
		void,
		| RRR.METADATA_NOT_LOADED
		| RRR.INVALID_FSID
		| RRR.METADATA_NOT_FOUND
		| RRR.INVALID_LABEL
		| RRR.USERS_NOT_LOADED
	>

	removeLabels: (
		fsid: FSID,
		...labels: string[]
	) => TResult<
		void,
		| RRR.METADATA_NOT_LOADED
		| RRR.INVALID_FSID
		| RRR.METADATA_NOT_FOUND
		| RRR.INVALID_LABEL
		| RRR.USERS_NOT_LOADED
	>

	replaceLabels: (
		fsid: FSID,
		labels: string[],
	) => TResult<
		void,
		| RRR.METADATA_NOT_LOADED
		| RRR.INVALID_FSID
		| RRR.METADATA_NOT_FOUND
		| RRR.INVALID_LABEL
		| RRR.USERS_NOT_LOADED
	>

	setSize: (
		fsid: FSID,
		size: number,
	) => TResult<
		void,
		| RRR.METADATA_NOT_LOADED
		| RRR.INVALID_FSID
		| RRR.METADATA_NOT_FOUND
		| RRR.INVALID_SIZE
		| RRR.USERS_NOT_LOADED
	>

	addLinks: (
		fsid: FSID,
		...links: FSID[]
	) => TResult<
		void,
		| RRR.METADATA_NOT_LOADED
		| RRR.INVALID_FSID
		| RRR.METADATA_NOT_FOUND
		| RRR.INVALID_LINK
		| RRR.USERS_NOT_LOADED
	>

	removeLinks: (
		fsid: FSID,
		...links: FSID[]
	) => TResult<
		void,
		| RRR.METADATA_NOT_LOADED
		| RRR.INVALID_FSID
		| RRR.METADATA_NOT_FOUND
		| RRR.INVALID_LINK
		| RRR.USERS_NOT_LOADED
	>

	replaceLinks: (
		fsid: FSID,
		links: FSID[],
	) => TResult<
		void,
		| RRR.METADATA_NOT_LOADED
		| RRR.INVALID_FSID
		| RRR.METADATA_NOT_FOUND
		| RRR.INVALID_LINK
		| RRR.USERS_NOT_LOADED
	>

	setParent: (
		fsid: FSID,
		parent: FSID | null,
	) => TResult<
		void,
		| RRR.METADATA_NOT_LOADED
		| RRR.INVALID_FSID
		| RRR.METADATA_NOT_FOUND
		| RRR.NAME_PARENT_TAKEN
		| RRR.INVALID_PARENT
		| RRR.USERS_NOT_LOADED
	>

	setName: (
		fsid: FSID,
		name: string,
	) => TResult<
		void,
		| RRR.METADATA_NOT_LOADED
		| RRR.INVALID_FSID
		| RRR.METADATA_NOT_FOUND
		| RRR.INVALID_NAME
		| RRR.NAME_PARENT_TAKEN
		| RRR.USERS_NOT_LOADED
	>

	setProperty: <_TProps_ extends TMetadataProps, __TKey__ extends keyof _TProps_>(
		fsid: FSID,
		key: __TKey__,
		value: _TProps_[__TKey__],
	) => TResult<
		void,
		| RRR.METADATA_NOT_LOADED
		| RRR.INVALID_FSID
		| RRR.INVALID_PROPS
		| RRR.METADATA_NOT_FOUND
		| RRR.USERS_NOT_LOADED
	>

	removeProperty: <_TProps_ extends TMetadataProps, __TKey__ extends keyof _TProps_>(
		fsid: FSID,
		key: __TKey__,
	) => TResult<
		void,
		| RRR.METADATA_NOT_LOADED
		| RRR.INVALID_FSID
		| RRR.INVALID_PROPS
		| RRR.METADATA_NOT_FOUND
		| RRR.USERS_NOT_LOADED
	>
}
