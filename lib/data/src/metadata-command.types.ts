import type { TEither } from "@ordo-pink/either"

import type { TCreateMetadataParams, TMetadata, TMetadataProps } from "./metadata.types"
import type { FSID } from "./data.types"
import type { RRR } from "./metadata.errors"
import type { TMetadataQuery } from "./metadata-query.types"
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
	) => TEither<
		void,
		| RRR.METADATA_NOT_LOADED
		| RRR.USERS_NOT_LOADED
		| RRR.INVALID_FSID
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

	replace: (value: TMetadata) => TEither<void, RRR.METADATA_NOT_LOADED | RRR.METADATA_NOT_FOUND>

	remove: (
		fsid: FSID,
	) => TEither<void, RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND>

	appendChild: (
		fsid: FSID,
		child: FSID,
	) => TEither<
		void,
		| RRR.METADATA_NOT_LOADED
		| RRR.INVALID_FSID
		| RRR.METADATA_NOT_FOUND
		| RRR.FSID_NOT_FOUND[]
		| RRR.INVALID_PARENT
		| RRR.CIRCULAR_PARENT_REFERENCE
	>

	addLabels: (
		fsid: FSID,
		...labels: string[]
	) => TEither<
		void,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.INVALID_LABEL
	>

	removeLabels: (
		fsid: FSID,
		...labels: string[]
	) => TEither<
		void,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.INVALID_LABEL
	>

	replaceLabels: (
		fsid: FSID,
		labels: string[],
	) => TEither<
		void,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.INVALID_LABEL
	>

	setSize: (
		fsid: FSID,
		size: number,
	) => TEither<
		void,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.INVALID_SIZE
	>

	addLinks: (
		fsid: FSID,
		...links: FSID[]
	) => TEither<
		void,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.INVALID_LINK
	>

	removeLinks: (
		fsid: FSID,
		...links: FSID[]
	) => TEither<
		void,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.INVALID_LINK
	>

	replaceLinks: (
		fsid: FSID,
		links: FSID[],
	) => TEither<
		void,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.INVALID_LINK
	>

	setParent: (
		fsid: FSID,
		parent: FSID | null,
	) => TEither<
		void,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.INVALID_PARENT
	>

	setName: (
		fsid: FSID,
		name: string,
	) => TEither<
		void,
		| RRR.METADATA_NOT_LOADED
		| RRR.INVALID_FSID
		| RRR.METADATA_NOT_FOUND
		| RRR.INVALID_NAME
		| RRR.NAME_PARENT_TAKEN
	>

	setProperty: <_TProps_ extends TMetadataProps, __TKey__ extends keyof _TProps_>(
		fsid: FSID,
		key: __TKey__,
		value: _TProps_[__TKey__],
	) => TEither<
		void,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.INVALID_PROPS | RRR.METADATA_NOT_FOUND
	>

	removeProperty: <_TProps_ extends TMetadataProps, __TKey__ extends keyof _TProps_>(
		fsid: FSID,
		key: __TKey__,
	) => TEither<
		void,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.INVALID_PROPS | RRR.METADATA_NOT_FOUND
	>
}
