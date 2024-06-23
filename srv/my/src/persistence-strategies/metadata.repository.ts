import { TEither } from "@ordo-pink/either"

type TFSID = string
type TUserID = string
export type TProps = Readonly<Record<string, any>>

export type TMetadataDTO<_TProps extends TProps = TProps> = Readonly<{
	fsid: TFSID
	name: string
	parent: TFSID | null
	links: TFSID[]
	labels: string[]
	contentType: string
	createdAt: number
	createdBy: TUserID
	updatedAt: number
	updatedBy: TUserID
	size: number
	properties?: _TProps
}>

// TODO: Add errors, use errors in Metadata & MetadataStatic methods
export enum TMetadataError {
	FSID_ALREADY_TAKEN,
	INVALID_NAME,
	INVALID_PARENT,
	PARENT_DOES_NOT_EXIST,
	CIRCULAR_PARENT_REFERENCE,
	INVALID_LINKS,
	INVALID_LABELS,
	INVALID_SIZE,
}

export type TMetadataDTOConstructor = <_TProps extends TProps = TProps>(
	p: Partial<TMetadataDTO<_TProps>>,
) => TEither<TMetadataDTO<_TProps>, TMetadataError>

// TODO: Move static creation methods to data mapper
// TODO: Move methods interacting with other entities to service
export type TMetadata<_TProps extends TProps = TProps> = {
	get metadataRepository(): TMetadataRepository

	equals: (other: TMetadata) => boolean

	getFSID: () => TFSID

	getName: () => string
	setName: (name: string) => TEither<TMetadata, TMetadataError.INVALID_NAME>

	getParent: () => TMetadata | null
	getAncestors: () => TMetadata[]
	hasParent: () => boolean
	setParent: (parent: TFSID | TMetadata | null) => TEither<TMetadata, TMetadataError.INVALID_PARENT>
	isChildOf: (parent: TFSID | TMetadata) => boolean
	isRootChild: () => boolean
	hasAncestor: (ancestor: TFSID | TMetadata) => boolean
	getChildren: () => TMetadata[]
	getDescendents: () => TMetadata[]
	hasChildren: () => boolean
	hasChild: (child: TFSID | TMetadata) => boolean
	hasDescendent: (descendent: TFSID | TMetadata) => boolean
	appendChildren: (...children: (TFSID | TMetadata)[]) => TEither<TMetadata, TMetadataError>
	removeChildren: (...children: (TFSID | TMetadata)[]) => TEither<TMetadata, TMetadataError>
	toTree: (
		withLinks?: "with-links",
	) => typeof withLinks extends "with-links" ? TMetadataBranchWithLinks : TMetadataBranch

	getLinks: () => TMetadata[]
	addLinks: (...links: (TFSID | TMetadata)[]) => TEither<TMetadata, TMetadataError.INVALID_LINKS>
	hasLinks: () => boolean
	hasLinkTo: (link: TFSID | TMetadata) => boolean
	removeLinks: (...links: (TFSID | TMetadata)[]) => TMetadata
	replaceLinks: (...links: (TFSID | TMetadata)[]) => TMetadata

	getLabels: () => string[]
	addLabels: (...labels: string[]) => TEither<TMetadata, TMetadataError.INVALID_LABELS>
	hasLabels: () => boolean
	hasLabel: (label: string) => boolean
	removeLabels: (...labels: string[]) => TMetadata
	replaceLabels: (...labels: string[]) => TMetadata

	getContentType: () => string

	getCreatedAt: () => Date

	getCreatedBy: () => TUserID // TODO: TPublicUser

	getUpdatedAt: () => Date

	getUpdatedBy: () => TUserID // TODO: TUser

	getSize: () => number
	getReadableSize: () => string
	setSize: (size: number) => TEither<TMetadata, TMetadataError.INVALID_SIZE>

	getProperty: <_TKey_ extends keyof _TProps>(key: _TKey_) => _TProps[_TKey_]
	setProperty: <_TKey_ extends keyof _TProps>(key: _TKey_, value: _TProps[_TKey_]) => TMetadata
	removeProperty: <_TKey_ extends keyof _TProps>(key: _TKey_) => TMetadata
}

export type TMetadataBranch = {
	isBranch: true
	isLeaf: false
	depth: number
	parent: TMetadata | null
	path: string
	data: TMetadata
	children: (TMetadataBranch | TMetadataLeaf)[]
}

export type TMetadataBranchWithLinks = TMetadataBranch & {
	children: (TMetadataBranchWithLinks | TMetadataLeafWithLinks)[]
	links: TMetadata[]
}

export type TMetadataLeaf = {
	isBranch: false
	isLeaf: true
	depth: number
	parent: TMetadata | null
	path: string
	data: TMetadata
}

export type TMetadataLeafWithLinks = TMetadataLeaf & { links: TMetadata[] }

// TODO:
export type TMetadataRepository = {
	create: () => any
	get: () => any
	update: () => any
	delete: () => any
}

// TODO:
export type TUserRepository = {
	get: () => any
	getCurrentUser: () => any
}

export type TMetadataDataMapper = {
	get userRepository(): TUserRepository

	fromDTO: <_TProps_ extends TProps = TProps>(
		metadata: TMetadataDTO<_TProps_>,
	) => TMetadata<_TProps_>
	toDTO: <_TProps_ extends TProps = TProps>(metadata: TMetadata<_TProps_>) => TMetadataDTO<_TProps_>
}

export type TMetadataService = {
	get metadataRepository(): TMetadataRepository
	get userRepository(): TUserRepository

	duplicate: (metadata: TMetadata) => TMetadata
	create: TMetadataStatic["of"]

	// find
	// filter
	// get
	// remove
	// update
}

export type TMetadataStatic = {
	Errors: TMetadataError
	// TODO: Strict param type
	of: <_TProps_ extends TProps = TProps>(
		p: Partial<TMetadataDTO<_TProps_>>,
	) => TEither<TMetadata, TMetadataError>
}
