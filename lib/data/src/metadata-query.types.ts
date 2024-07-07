import type { TOption } from "@ordo-pink/option"
import type { TResult } from "@ordo-pink/result"

import type { RRR, TRrr } from "./metadata.errors"
import type { FSID } from "./data.types"
import type { TMetadata } from "./metadata.types"
import type { TMetadataRepository } from "./metadata-repository.types"

export type TMetadataQueryOptions = { showHidden?: boolean }

export type TMetadataQueryStatic = {
	of: (metadataRepository: TMetadataRepository) => TMetadataQuery
}

export type TMetadataQuery = {
	metadataRepository: TMetadataRepository

	get: (options?: TMetadataQueryOptions) => TResult<TOption<TMetadata[]>, TRrr<"EAGAIN">>

	getByFSID: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<TOption<TMetadata>, TRrr<"EAGAIN" | "EINVAL">>

	total: (options?: TMetadataQueryOptions) => TResult<number, TRrr<"EAGAIN">>

	getByNameAndParent: (
		name: string,
		parent: FSID | null,
		options?: TMetadataQueryOptions,
	) => TResult<TOption<TMetadata>, TRrr<"EAGAIN" | "EINVAL">>

	getByLabels: (
		labels: string[],
		options?: TMetadataQueryOptions,
	) => TResult<TOption<TMetadata[]>, TRrr<"EAGAIN" | "EINVAL">>

	hasIncomingLinks: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<boolean, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	getIncomingLinks: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<TOption<TMetadata[]>, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	getParent: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<TOption<TMetadata>, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	getAncestors: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<TOption<TMetadata[]>, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	hasAncestor: (
		fsid: FSID,
		ancestor: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<boolean, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	hasChild: (
		fsid: FSID,
		child: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<boolean, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	hasChildren: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<boolean, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	getChildren: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<TOption<TMetadata[]>, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	hasDescendent: (
		fsid: FSID,
		descendent: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<boolean, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	hasDescendents: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<boolean, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	getDescendents: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<TOption<TMetadata[]>, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	// TODO: toTree: (source: TFSID | null) => typeof source extends null ? TMetadataBranch[] : TMetadataBranch

	// TODO: toGraph: (
	// 	source: TFSID | null,
	// ) => typeof source extends null ? TMetadataBranchWithLinks[] : TMetadataBranchWithLinks
}

// export type TMetadataNode = TMetadataBranch | TMetadataLeaf

// export type TMetadataWithLinksNode = TMetadataBranchWithLinks | TMetadataLeafWithLinks

// export type TMetadataBranch = {
// 	isBranch: true
// 	isLeaf: false
// 	hasLinks: false
// 	depth: number
// 	parent: TMetadataBranch | null
// 	path: string
// 	data: TMetadata
// 	children: TMetadataNode[]
// }

// export type TMetadataBranchWithLinks = TMetadataBranch & {
// 	hasLinks: true
// 	links: TMetadata[]
// 	parent: TMetadataBranchWithLinks
// 	children: TMetadataWithLinksNode[]
// }

// export type TMetadataLeaf = {
// 	isBranch: false
// 	isLeaf: true
// 	hasLinks: false
// 	depth: number
// 	parent: TMetadataBranch | null
// 	path: string
// 	data: TMetadata
// }

// export type TMetadataLeafWithLinks = TMetadataLeaf & {
// 	hasLinks: true
// 	links: TMetadata[]
// 	parent: TMetadataBranchWithLinks | null
// }
