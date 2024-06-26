import type { BehaviorSubject } from "rxjs"

import type { TEither } from "@ordo-pink/either"

import type { FSID } from "./data.types"
import type { RRR } from "./metadata.errors"
import type { TMetadata } from "./metadata.types"

export type TMetadataQueryOptions = { showHidden?: boolean }

export type TMetadataQuery = {
	metadata$: BehaviorSubject<TMetadata[] | null>

	get: (options?: TMetadataQueryOptions) => TEither<TMetadata[], RRR.METADATA_NOT_LOADED>

	getByFSIDE: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<TMetadata | null, RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID>

	total: (options?: TMetadataQueryOptions) => TEither<number, RRR.METADATA_NOT_LOADED>

	getByNameAndParentE: (
		name: string,
		parent: FSID | null,
		options?: TMetadataQueryOptions,
	) => TEither<TMetadata | null, RRR.METADATA_NOT_LOADED | RRR.INVALID_NAME | RRR.INVALID_PARENT>

	getByLabelsE: (
		labels: string[],
		options?: TMetadataQueryOptions,
	) => TEither<TMetadata[], RRR.METADATA_NOT_LOADED | RRR.INVALID_LABEL>

	hasIncomingLinksE: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<boolean, RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND>

	getIncomingLinksE: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<TMetadata[], RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND>

	getParentE: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<
		TMetadata | null,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.PARENT_NOT_FOUND
	>

	getAncestorsE: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<TMetadata[], RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND>

	hasAncestorE: (
		fsid: FSID,
		ancestor: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<
		boolean,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.INVALID_ANCESTOR
	>

	hasChildE: (
		fsid: FSID,
		child: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<
		boolean,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.INVALID_CHILD
	>

	hasChildrenE: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<boolean, RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND>

	getChildrenE: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<TMetadata[], RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND>

	hasDescendentE: (
		fsid: FSID,
		descendent: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<
		boolean,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.INVALID_DESCENDENT
	>

	hasDescendentsE: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<boolean, RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND>

	getDescendentsE: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<TMetadata[], RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND>

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
