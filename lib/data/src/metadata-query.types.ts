import type { TEither } from "@ordo-pink/either"
import type { TResult } from "@ordo-pink/result"

import type { FSID } from "./data.types"
import type { RRR } from "./metadata.errors"
import type { TMetadata } from "./metadata.types"
import type { TMetadataRepository } from "./metadata-repository.types"

export type TMetadataQueryOptions = { showHidden?: boolean }

export type TMetadataQueryStatic = {
	of: (metadataRepository: TMetadataRepository) => TMetadataQuery
}

export type TMetadataQuery = {
	metadataRepository: TMetadataRepository

	get: (options?: TMetadataQueryOptions) => TResult<TMetadata[], RRR.MR_EAGAIN>

	getByFSID: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<TEither<TMetadata, null>, RRR.MR_EAGAIN | RRR.MV_EINVAL_FSID>

	total: (options?: TMetadataQueryOptions) => TResult<number, RRR.MR_EAGAIN>

	getByNameAndParent: (
		name: string,
		parent: FSID | null,
		options?: TMetadataQueryOptions,
	) => TResult<TEither<TMetadata, null>, RRR.MR_EAGAIN | RRR.MV_EINVAL_NAME | RRR.MV_EINVAL_PARENT>

	getByLabels: (
		labels: string[],
		options?: TMetadataQueryOptions,
	) => TResult<TMetadata[], RRR.MR_EAGAIN | RRR.MQ_INVALID_LABEL>

	hasIncomingLinks: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<boolean, RRR.MR_EAGAIN | RRR.MV_EINVAL_FSID | RRR.MQ_ENOENT>

	getIncomingLinks: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<TMetadata[], RRR.MR_EAGAIN | RRR.MV_EINVAL_FSID | RRR.MQ_ENOENT>

	getParent: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<
		TEither<TMetadata, null>,
		RRR.MR_EAGAIN | RRR.MV_EINVAL_FSID | RRR.MQ_ENOENT | RRR.MC_ENOENT_PARENT
	>

	getAncestors: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<TMetadata[], RRR.MV_EINVAL_FSID | RRR.MQ_ENOENT>

	hasAncestor: (
		fsid: FSID,
		ancestor: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<boolean, RRR.MR_EAGAIN | RRR.MV_EINVAL_FSID | RRR.MQ_ENOENT | RRR.MV_EINVAL_ANCESTOR>

	hasChild: (
		fsid: FSID,
		child: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<boolean, RRR.MR_EAGAIN | RRR.MV_EINVAL_FSID | RRR.MQ_ENOENT | RRR.MQ_INVALID_CHILD>

	hasChildren: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<boolean, RRR.MR_EAGAIN | RRR.MV_EINVAL_FSID | RRR.MQ_ENOENT>

	getChildren: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<TMetadata[], RRR.MR_EAGAIN | RRR.MV_EINVAL_FSID | RRR.MQ_ENOENT>

	hasDescendent: (
		fsid: FSID,
		descendent: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<
		boolean,
		RRR.MR_EAGAIN | RRR.MV_EINVAL_FSID | RRR.MQ_ENOENT | RRR.MQ_INVALID_DESCENDENT
	>

	hasDescendents: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<boolean, RRR.MR_EAGAIN | RRR.MV_EINVAL_FSID | RRR.MQ_ENOENT>

	getDescendents: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<TMetadata[], RRR.MR_EAGAIN | RRR.MV_EINVAL_FSID | RRR.MQ_ENOENT>

	// TODO: toTree: (source: TFSID | null) => typeof source extends null ? TMetadataBranch[] : TMetadataBranch

	// TODO: toGraph: (
	// 	source: TFSID | null,
	// ) => typeof source extends null ? TMetadataBranchWithLinks[] : TMetadataBranchWithLinks
}

export type TMetadataNode = TMetadataBranch | TMetadataLeaf

export type TMetadataWithLinksNode = TMetadataBranchWithLinks | TMetadataLeafWithLinks

export type TMetadataBranch = {
	isBranch: true
	isLeaf: false
	hasLinks: false
	depth: number
	parent: TMetadataBranch | null
	path: string
	data: TMetadata
	children: TMetadataNode[]
}

export type TMetadataBranchWithLinks = TMetadataBranch & {
	hasLinks: true
	links: TMetadata[]
	parent: TMetadataBranchWithLinks
	children: TMetadataWithLinksNode[]
}

export type TMetadataLeaf = {
	isBranch: false
	isLeaf: true
	hasLinks: false
	depth: number
	parent: TMetadataBranch | null
	path: string
	data: TMetadata
}

export type TMetadataLeafWithLinks = TMetadataLeaf & {
	hasLinks: true
	links: TMetadata[]
	parent: TMetadataBranchWithLinks | null
}
