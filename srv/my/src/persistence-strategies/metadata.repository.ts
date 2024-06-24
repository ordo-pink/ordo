import { type TEither, fromNullableE, mapE } from "@ordo-pink/either"
import { type UUIDv4 } from "@ordo-pink/tau"

type FSID = UUIDv4
type TUserID = string

export type TMetadataProps = Readonly<Record<string, any>>

export type TCreateMetadataParams<_TProps extends TMetadataProps = TMetadataProps> = Partial<
	Omit<TMetadataDTO<_TProps>, "createdBy" | "createdAt" | "size" | "updatedAt" | "updatedBy">
> &
	Pick<TMetadataDTO<_TProps>, "name" | "parent">

export type TMetadataDTO<_TProps extends TMetadataProps = TMetadataProps> = Readonly<{
	fsid: FSID
	name: string
	parent: FSID | null
	links: FSID[]
	labels: string[]
	contentType: string
	createdAt: number
	createdBy: TUserID
	updatedAt: number
	updatedBy: TUserID
	size: number
	properties?: _TProps
}>

export enum MetadataError {
	METADATA_NOT_FOUND,
	INVALID_FSID,
	FSID_ALREADY_TAKEN,
	FSID_NOT_FOUND,
	INVALID_NAME,
	NAME_ALREADY_TAKEN_UNDER_GIVEN_PARENT,
	INVALID_PARENT,
	PARENT_DOES_NOT_EXIST,
	ANCESTOR_DOES_NOT_EXIST,
	CHILD_DOES_NOT_EXIST,
	DESCENDENT_DOES_NOT_EXIST,
	LINK_DOES_NOT_EXIST,
	CIRCULAR_PARENT_REFERENCE,
	INVALID_LINK,
	INVALID_LABEL,
	INVALID_SIZE,
	INVALID_CONTENT_TYPE,
}

export type TMetadataDTOConstructor = <_TProps extends TMetadataProps = TMetadataProps>(
	p: Partial<TMetadataDTO<_TProps>>,
) => TEither<TMetadataDTO<_TProps>, MetadataError>

export type TMetadata<_TProps extends TMetadataProps = TMetadataProps> = {
	getFSID: () => FSID
	getName: () => string
	getParent: () => FSID | null
	isRootChild: () => boolean
	isChildOf: (parent: FSID) => boolean
	getLinks: () => FSID[]
	hasLinks: () => boolean
	hasLinkTo: (link: FSID) => boolean
	getLabels: () => string[]
	hasLabels: () => boolean
	hasLabel: (label: string) => boolean
	getContentType: () => string
	getCreatedAt: () => Date
	getCreatedBy: () => TUserID
	getUpdatedAt: () => Date
	getUpdatedBy: () => TUserID
	getSize: () => number
	getReadableSize: () => string
	getProperty: <_TKey_ extends keyof _TProps>(key: _TKey_) => TEither<_TProps[_TKey_], null>
}

export type TMetadataQueryOptions = { showHidden?: boolean }

export type TMetadataQuery = {
	getByFSID: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<TMetadata, MetadataError.INVALID_FSID | MetadataError.METADATA_NOT_FOUND>

	total: (options?: TMetadataQueryOptions) => TEither<number, never>

	getByNameAndParent: (
		name: string,
		parent: FSID | null,
		options?: TMetadataQueryOptions,
	) => TEither<TMetadata | null, MetadataError.INVALID_NAME | MetadataError.INVALID_PARENT>

	getByLabels: (
		labels: string[],
		options?: TMetadataQueryOptions,
	) => TEither<TMetadata[], MetadataError.INVALID_LABEL>

	hasIncomingLinks: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<boolean, MetadataError.INVALID_FSID | MetadataError.METADATA_NOT_FOUND>

	getIncomingLinks: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<TMetadata[], MetadataError.INVALID_FSID | MetadataError.METADATA_NOT_FOUND>

	getParent: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<
		TMetadata | null,
		| MetadataError.INVALID_FSID
		| MetadataError.METADATA_NOT_FOUND
		| MetadataError.PARENT_DOES_NOT_EXIST
	>

	hasParent: (
		fsid: FSID,
		parent: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<
		boolean,
		| MetadataError.INVALID_FSID
		| MetadataError.METADATA_NOT_FOUND
		| MetadataError.PARENT_DOES_NOT_EXIST
	>

	getAncestors: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<TMetadata[], MetadataError.INVALID_FSID | MetadataError.METADATA_NOT_FOUND>

	hasAncestor: (
		fsid: FSID,
		ancestor: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<
		boolean,
		| MetadataError.INVALID_FSID
		| MetadataError.METADATA_NOT_FOUND
		| MetadataError.ANCESTOR_DOES_NOT_EXIST
	>

	hasChild: (
		fsid: FSID,
		child: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<
		boolean,
		| MetadataError.INVALID_FSID
		| MetadataError.METADATA_NOT_FOUND
		| MetadataError.CHILD_DOES_NOT_EXIST
	>

	hasChildren: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<boolean, MetadataError.INVALID_FSID | MetadataError.METADATA_NOT_FOUND>

	getChildren: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<TMetadata[], MetadataError.INVALID_FSID | MetadataError.METADATA_NOT_FOUND>

	hasDescendent: (
		fsid: FSID,
		descendent: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<
		boolean,
		| MetadataError.INVALID_FSID
		| MetadataError.METADATA_NOT_FOUND
		| MetadataError.DESCENDENT_DOES_NOT_EXIST
	>

	hasDescendents: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<boolean, MetadataError.INVALID_FSID | MetadataError.METADATA_NOT_FOUND>

	getDescendents: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<boolean, MetadataError.INVALID_FSID | MetadataError.METADATA_NOT_FOUND>

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

// TODO:
export type TMetadataRepository = {
	create: () => any
	get: () => any
	update: () => any
	delete: () => any
}

// TODO:
export type TUserRepository = {
	getUser: (userId: TUserID) => any
	getCurrentUser: () => any
}

export type TMetadataDataMapper = {
	get metadataRepository(): TMetadataRepository
	get userRepository(): TUserRepository

	fromDTO: <_TProps_ extends TMetadataProps = TMetadataProps>(
		metadata: TMetadataDTO<_TProps_>,
	) => TMetadata<_TProps_>
	toDTO: <_TProps_ extends TMetadataProps = TMetadataProps>(
		metadata: TMetadata<_TProps_>,
	) => TMetadataDTO<_TProps_>
}

export type TMetadataService = {
	get metadataRepository(): TMetadataRepository
	get userRepository(): TUserRepository

	create: (
		p: TCreateMetadataParams,
	) => TEither<
		void,
		| MetadataError.INVALID_NAME
		| MetadataError.INVALID_PARENT
		| MetadataError.NAME_ALREADY_TAKEN_UNDER_GIVEN_PARENT
		| MetadataError.INVALID_LABEL
		| MetadataError.INVALID_LINK
		| MetadataError.PARENT_DOES_NOT_EXIST
		| MetadataError.INVALID_CONTENT_TYPE
	>

	duplicate: (metadata: FSID | TMetadata) => TEither<void, never>

	remove: (
		metadata: FSID | TMetadata,
	) => TEither<void, MetadataError.INVALID_FSID | MetadataError.METADATA_NOT_FOUND>

	appendChildren: (
		metadata: FSID | TMetadata,
		...children: (FSID | TMetadata)[]
	) => TEither<
		void,
		| MetadataError.INVALID_FSID
		| MetadataError.METADATA_NOT_FOUND
		| MetadataError.FSID_NOT_FOUND[]
		| MetadataError.INVALID_PARENT
		| MetadataError.CIRCULAR_PARENT_REFERENCE
	>

	removeChildren: (
		fsid: FSID,
		...children: FSID[]
	) => TEither<void, MetadataError.INVALID_FSID | MetadataError.METADATA_NOT_FOUND>

	addLabels: (
		fsid: FSID,
		...labels: string[]
	) => TEither<
		void,
		MetadataError.INVALID_FSID | MetadataError.METADATA_NOT_FOUND | MetadataError.INVALID_LABEL[]
	>

	removeLabels: (
		fsid: FSID,
		...labels: string[]
	) => TEither<
		void,
		MetadataError.INVALID_FSID | MetadataError.METADATA_NOT_FOUND | MetadataError.INVALID_LABEL[]
	>

	replaceLabels: (
		fsid: FSID,
		labels: string[],
	) => TEither<
		void,
		MetadataError.INVALID_FSID | MetadataError.METADATA_NOT_FOUND | MetadataError.INVALID_LABEL[]
	>

	setSize: (
		fsid: FSID,
		size: number,
	) => TEither<
		void,
		MetadataError.INVALID_FSID | MetadataError.METADATA_NOT_FOUND | MetadataError.INVALID_SIZE
	>

	addLinks: (
		fsid: FSID,
		...links: FSID[]
	) => TEither<
		void,
		MetadataError.INVALID_FSID | MetadataError.METADATA_NOT_FOUND | MetadataError.INVALID_LINK[]
	>

	removeLinks: (
		metadata: TMetadata,
		...links: FSID[]
	) => TEither<
		void,
		MetadataError.INVALID_FSID | MetadataError.METADATA_NOT_FOUND | MetadataError.INVALID_LINK[]
	>

	replaceLinks: (
		metadata: TMetadata,
		links: FSID[],
	) => TEither<
		void,
		MetadataError.INVALID_FSID | MetadataError.METADATA_NOT_FOUND | MetadataError.INVALID_LINK[]
	>

	setParent: (
		fsid: FSID,
		parent: FSID | null,
	) => TEither<
		void,
		MetadataError.INVALID_FSID | MetadataError.METADATA_NOT_FOUND | MetadataError.INVALID_PARENT
	>

	setName: (
		fsid: FSID,
		name: string,
	) => TEither<
		void,
		| MetadataError.INVALID_FSID
		| MetadataError.METADATA_NOT_FOUND
		| MetadataError.INVALID_NAME
		| MetadataError.NAME_ALREADY_TAKEN_UNDER_GIVEN_PARENT
	>

	setProperty: <_TProps_ extends TMetadataProps, __TKey__ extends keyof _TProps_>(
		fsid: FSID,
		key: __TKey__,
		value: _TProps_[__TKey__],
	) => TEither<void, MetadataError.INVALID_FSID | MetadataError.METADATA_NOT_FOUND>

	removeProperty: <_TProps_ extends TMetadataProps, __TKey__ extends keyof _TProps_>(
		fsid: FSID,
		key: __TKey__,
	) => TEither<void, MetadataError.INVALID_FSID | MetadataError.METADATA_NOT_FOUND>
}

export const Metadata = <_TProps_ extends TMetadataProps = TMetadataProps>(
	dto: TMetadataDTO<_TProps_>,
): TMetadata<_TProps_> => ({
	getFSID: () => dto.fsid,
	getName: () => dto.name,
	getContentType: () => dto.contentType,
	getCreatedAt: () => new Date(dto.createdAt),
	getCreatedBy: () => dto.createdBy,
	getUpdatedAt: () => new Date(dto.updatedAt),
	getUpdatedBy: () => dto.updatedBy,
	getLabels: () => dto.labels,
	getLinks: () => [...dto.links],
	getParent: () => dto.parent,
	getProperty: key => fromNullableE(dto.properties).pipe(mapE(props => props[key])),
	getReadableSize: () => getReadableSize(dto.size),
	getSize: () => dto.size,
	hasLabel: label => dto.labels.includes(label),
	hasLabels: () => dto.labels.length > 0,
	hasLinks: () => dto.links.length > 0,
	hasLinkTo: fsid => dto.links.includes(fsid),
	isChildOf: fsid => dto.parent === fsid,
	isRootChild: () => dto.parent === null,
})

// --- Internal ---

const getReadableSize = (size: number, decimals = 2) => {
	if (!size) return "0B"

	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

	const i = Math.floor(Math.log(size) / Math.log(k))

	return `${parseFloat((size / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`
}
