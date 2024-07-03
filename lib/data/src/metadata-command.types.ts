import type { TResult } from "@ordo-pink/result"

import type { TCreateMetadataParams, TMetadata, TMetadataProps } from "./metadata.types"
import type { FSID } from "./data.types"
import type { RRR } from "./metadata.errors"
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
	) => TResult<
		void,
		| RRR.UR_EAGAIN
		| RRR.MR_EAGAIN
		| RRR.MR_EPERM
		| RRR.MC_FSID_CONFLICT
		| RRR.MV_EINVAL_NAME
		| RRR.MV_EINVAL_PARENT
		| RRR.MC_NAME_CONFLICT
		| RRR.MQ_INVALID_LABEL
		| RRR.MQ_INVALID_LINK
		| RRR.MC_ENOENT_PARENT
		| RRR.MQ_INVALID_TYPE
		| RRR.MQ_INVALID_PROPS
	>

	replace: (
		value: TMetadata,
	) => TResult<void, RRR.MR_EAGAIN | RRR.MQ_ENOENT | RRR.UR_EAGAIN | RRR.MR_EPERM>

	remove: (
		fsid: FSID,
	) => TResult<
		void,
		RRR.MR_EAGAIN | RRR.MV_EINVAL_FSID | RRR.MQ_ENOENT | RRR.UR_EAGAIN | RRR.MR_EPERM
	>

	appendChild: (
		fsid: FSID,
		child: FSID,
	) => TResult<
		void,
		| RRR.MR_EAGAIN
		| RRR.MV_EINVAL_FSID
		| RRR.MQ_ENOENT
		| RRR.MQ_ENOENT_FSID
		| RRR.MC_NAME_CONFLICT
		| RRR.MV_EINVAL_PARENT
		| RRR.MQ_CIRCULAR_PARENT_REFERENCE
		| RRR.UR_EAGAIN
		| RRR.MR_EPERM
	>

	addLabels: (
		fsid: FSID,
		...labels: string[]
	) => TResult<
		void,
		| RRR.MR_EAGAIN
		| RRR.MV_EINVAL_FSID
		| RRR.MQ_ENOENT
		| RRR.MQ_INVALID_LABEL
		| RRR.UR_EAGAIN
		| RRR.MR_EPERM
	>

	removeLabels: (
		fsid: FSID,
		...labels: string[]
	) => TResult<
		void,
		| RRR.MR_EAGAIN
		| RRR.MV_EINVAL_FSID
		| RRR.MQ_ENOENT
		| RRR.MQ_INVALID_LABEL
		| RRR.UR_EAGAIN
		| RRR.MR_EPERM
	>

	replaceLabels: (
		fsid: FSID,
		labels: string[],
	) => TResult<
		void,
		| RRR.MR_EAGAIN
		| RRR.MV_EINVAL_FSID
		| RRR.MQ_ENOENT
		| RRR.MQ_INVALID_LABEL
		| RRR.UR_EAGAIN
		| RRR.MR_EPERM
	>

	setSize: (
		fsid: FSID,
		size: number,
	) => TResult<
		void,
		| RRR.MR_EAGAIN
		| RRR.MV_EINVAL_FSID
		| RRR.MQ_ENOENT
		| RRR.MQ_INVALID_SIZE
		| RRR.UR_EAGAIN
		| RRR.MR_EPERM
	>

	addLinks: (
		fsid: FSID,
		...links: FSID[]
	) => TResult<
		void,
		| RRR.MR_EAGAIN
		| RRR.MV_EINVAL_FSID
		| RRR.MQ_ENOENT
		| RRR.MQ_INVALID_LINK
		| RRR.UR_EAGAIN
		| RRR.MR_EPERM
	>

	removeLinks: (
		fsid: FSID,
		...links: FSID[]
	) => TResult<
		void,
		| RRR.MR_EAGAIN
		| RRR.MV_EINVAL_FSID
		| RRR.MQ_ENOENT
		| RRR.MQ_INVALID_LINK
		| RRR.UR_EAGAIN
		| RRR.MR_EPERM
	>

	replaceLinks: (
		fsid: FSID,
		links: FSID[],
	) => TResult<
		void,
		| RRR.MR_EAGAIN
		| RRR.MV_EINVAL_FSID
		| RRR.MQ_ENOENT
		| RRR.MQ_INVALID_LINK
		| RRR.UR_EAGAIN
		| RRR.MR_EPERM
	>

	setParent: (
		fsid: FSID,
		parent: FSID | null,
	) => TResult<
		void,
		| RRR.MR_EAGAIN
		| RRR.MV_EINVAL_FSID
		| RRR.MQ_ENOENT
		| RRR.MC_NAME_CONFLICT
		| RRR.MV_EINVAL_PARENT
		| RRR.UR_EAGAIN
		| RRR.MR_EPERM
	>

	setName: (
		fsid: FSID,
		name: string,
	) => TResult<
		void,
		| RRR.MR_EAGAIN
		| RRR.MV_EINVAL_FSID
		| RRR.MQ_ENOENT
		| RRR.MV_EINVAL_NAME
		| RRR.MC_NAME_CONFLICT
		| RRR.UR_EAGAIN
		| RRR.MR_EPERM
	>

	setProperty: <_TProps_ extends TMetadataProps, __TKey__ extends keyof _TProps_>(
		fsid: FSID,
		key: __TKey__,
		value: _TProps_[__TKey__],
	) => TResult<
		void,
		| RRR.MR_EAGAIN
		| RRR.MV_EINVAL_FSID
		| RRR.MQ_INVALID_PROPS
		| RRR.MQ_ENOENT
		| RRR.UR_EAGAIN
		| RRR.MR_EPERM
	>

	removeProperty: <_TProps_ extends TMetadataProps, __TKey__ extends keyof _TProps_>(
		fsid: FSID,
		key: __TKey__,
	) => TResult<
		void,
		| RRR.MR_EAGAIN
		| RRR.MV_EINVAL_FSID
		| RRR.MQ_INVALID_PROPS
		| RRR.MQ_ENOENT
		| RRR.UR_EAGAIN
		| RRR.MR_EPERM
	>
}
