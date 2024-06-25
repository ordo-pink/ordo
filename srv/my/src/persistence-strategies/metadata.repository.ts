import { BehaviorSubject } from "rxjs"

import {
	type TEither,
	chainE,
	fromBooleanE,
	fromNullableE,
	leftMapE,
	mapE,
	ofE,
} from "@ordo-pink/either"
import { type UUIDv4, isNonEmptyString, isUUID, isObject } from "@ordo-pink/tau"
import { UserID } from "@ordo-pink/data"

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

export enum RRR {
	METADATA_NOT_LOADED,
	METADATA_NOT_FOUND,
	INVALID_FSID,
	FSID_ALREADY_TAKEN,
	FSID_NOT_FOUND,
	INVALID_NAME,
	NAME_ALREADY_TAKEN_UNDER_GIVEN_PARENT,
	INVALID_PARENT,
	INVALID_ANCESTOR,
	INVALID_DESCENDENT,
	INVALID_CHILD,
	PARENT_NOT_FOUND,
	LINK_DOES_NOT_EXIST,
	CIRCULAR_PARENT_REFERENCE,
	INVALID_LINK,
	INVALID_LABEL,
	INVALID_SIZE,
	INVALID_CTYPE,
	INVALID_PROPERTIES,

	// TODO: Extract
	USERS_NOT_LOADED,
}

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
	toDTO: () => TMetadataDTO<_TProps>
}

export type TMetadataQueryOptions = { showHidden?: boolean }

export type TMetadataQuery = {
	metadata$: BehaviorSubject<TMetadata[] | null>

	get: (options?: TMetadataQueryOptions) => TEither<TMetadata[], RRR.METADATA_NOT_LOADED>

	getByFSID: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<TMetadata | null, RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID>

	total: (options?: TMetadataQueryOptions) => TEither<number, RRR.METADATA_NOT_LOADED>

	getByNameAndParent: (
		name: string,
		parent: FSID | null,
		options?: TMetadataQueryOptions,
	) => TEither<TMetadata | null, RRR.METADATA_NOT_LOADED | RRR.INVALID_NAME | RRR.INVALID_PARENT>

	getByLabels: (
		labels: string[],
		options?: TMetadataQueryOptions,
	) => TEither<TMetadata[], RRR.METADATA_NOT_LOADED | RRR.INVALID_LABEL>

	hasIncomingLinks: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<boolean, RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND>

	getIncomingLinks: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<TMetadata[], RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND>

	getParent: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<
		TMetadata | null,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.PARENT_NOT_FOUND
	>

	getAncestors: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<TMetadata[], RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND>

	hasAncestor: (
		fsid: FSID,
		ancestor: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<
		boolean,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.INVALID_ANCESTOR
	>

	hasChild: (
		fsid: FSID,
		child: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<
		boolean,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.INVALID_CHILD
	>

	hasChildren: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<boolean, RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND>

	getChildren: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<TMetadata[], RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND>

	hasDescendent: (
		fsid: FSID,
		descendent: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<
		boolean,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.INVALID_DESCENDENT
	>

	hasDescendents: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TEither<boolean, RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND>

	getDescendents: (
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
	getCurrentUserID: () => TEither<UserID, RRR.USERS_NOT_LOADED>
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

export type TMetadataCommand = {
	write: (metadata: TMetadata[]) => void

	create: (
		params: TCreateMetadataParams,
	) => TEither<
		void,
		| RRR.METADATA_NOT_LOADED
		| RRR.INVALID_NAME
		| RRR.INVALID_PARENT
		| RRR.NAME_ALREADY_TAKEN_UNDER_GIVEN_PARENT
		| RRR.INVALID_LABEL
		| RRR.INVALID_LINK
		| RRR.PARENT_NOT_FOUND
		| RRR.INVALID_CTYPE
	>

	remove: (
		fsid: FSID,
	) => TEither<void, RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND>

	appendChildren: (
		fsid: FSID,
		...children: FSID[]
	) => TEither<
		void,
		| RRR.METADATA_NOT_LOADED
		| RRR.INVALID_FSID
		| RRR.METADATA_NOT_FOUND
		| RRR.FSID_NOT_FOUND[]
		| RRR.INVALID_PARENT
		| RRR.CIRCULAR_PARENT_REFERENCE
	>

	removeChildren: (
		fsid: FSID,
		...children: FSID[]
	) => TEither<void, RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND>

	addLabels: (
		fsid: FSID,
		...labels: string[]
	) => TEither<
		void,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.INVALID_LABEL[]
	>

	removeLabels: (
		fsid: FSID,
		...labels: string[]
	) => TEither<
		void,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.INVALID_LABEL[]
	>

	replaceLabels: (
		fsid: FSID,
		labels: string[],
	) => TEither<
		void,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.INVALID_LABEL[]
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
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.INVALID_LINK[]
	>

	removeLinks: (
		fsid: FSID,
		...links: FSID[]
	) => TEither<
		void,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.INVALID_LINK[]
	>

	replaceLinks: (
		fsid: FSID,
		links: FSID[],
	) => TEither<
		void,
		RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND | RRR.INVALID_LINK[]
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
		| RRR.NAME_ALREADY_TAKEN_UNDER_GIVEN_PARENT
	>

	setProperty: <_TProps_ extends TMetadataProps, __TKey__ extends keyof _TProps_>(
		fsid: FSID,
		key: __TKey__,
		value: _TProps_[__TKey__],
	) => TEither<void, RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND>

	removeProperty: <_TProps_ extends TMetadataProps, __TKey__ extends keyof _TProps_>(
		fsid: FSID,
		key: __TKey__,
	) => TEither<void, RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID | RRR.METADATA_NOT_FOUND>
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
	toDTO: () => dto,
})

export const MetadataQuery = (metadata$: BehaviorSubject<TMetadata[] | null>): TMetadataQuery => ({
	metadata$,

	get: ({ showHidden } = { showHidden: false }) =>
		fromNullableE(metadata$.getValue())
			.pipe(mapE(metadata => (showHidden ? metadata : metadata.filter(negate(isHidden)))))
			.pipe(leftMapE(() => RRR.METADATA_NOT_LOADED)),

	getByFSID: (fsid, options) =>
		fromBooleanE(isUUID(fsid), null, RRR.INVALID_FSID as const)
			.pipe(chainE(() => MetadataQuery(metadata$).get(options)))
			.pipe(mapE(m => m.find(i => i.getFSID() === fsid) ?? null)),

	getByLabels: (labels, options) =>
		fromBooleanE(checkAll(isNonEmptyString, labels), null, RRR.INVALID_LABEL as const)
			.pipe(chainE(() => MetadataQuery(metadata$).get(options)))
			.pipe(mapE(metadata => metadata.filter(hasAllLabels(labels)))),

	getByNameAndParent: (name, parent, options) =>
		fromBooleanE(isNonEmptyString(name), null, RRR.INVALID_NAME as const)
			.pipe(chainE(() => fromBooleanE(isValidParent(parent), null, RRR.INVALID_PARENT as const)))
			.pipe(chainE(() => MetadataQuery(metadata$).get(options)))
			.pipe(mapE(m => m.find(i => i.getName() === name && i.getParent() === parent) ?? null)),

	getChildren: (fsid, options) =>
		fromBooleanE(isUUID(fsid), null, RRR.INVALID_FSID as const)
			.pipe(chainE(() => MetadataQuery(metadata$).get(options)))
			.pipe(mapE(metadata => metadata.filter(item => item.getParent() === fsid))),

	getParent: (fsid, options) =>
		MetadataQuery(metadata$)
			.getByFSID(fsid, options)
			.pipe(mapE(item => item?.getParent()))
			.pipe(chainE(fsid => (fsid ? MetadataQuery(metadata$).getByFSID(fsid) : ofE(null)))),

	hasChild: (fsid, child, options) =>
		fromBooleanE(isUUID(child), null, RRR.INVALID_CHILD as const)
			.pipe(chainE(() => MetadataQuery(metadata$).getChildren(fsid, options)))
			.pipe(mapE(children => children.some(item => item.getFSID() === child))),

	getIncomingLinks: (fsid, options) =>
		fromBooleanE(isUUID(fsid), null, RRR.INVALID_FSID as const)
			.pipe(chainE(() => MetadataQuery(metadata$).get(options)))
			.pipe(mapE(metadata => metadata.filter(item => item.getLinks().includes(fsid)))),

	hasIncomingLinks: (fsid, options) =>
		MetadataQuery(metadata$)
			.getIncomingLinks(fsid, options)
			.pipe(mapE(items => items.length > 0)),

	hasChildren: (fsid, options) =>
		MetadataQuery(metadata$)
			.getChildren(fsid, options)
			.pipe(mapE(items => items.length > 0)),

	getAncestors: () => null as any,

	hasAncestor: (fsid, ancestor, options) =>
		fromBooleanE(isUUID(ancestor), null, RRR.INVALID_ANCESTOR as const)
			.pipe(chainE(() => MetadataQuery(metadata$).getAncestors(fsid, options)))
			.pipe(mapE(ancestors => ancestors.some(item => item.getFSID() === ancestor))),

	getDescendents: () => null as any,

	hasDescendent: (fsid, descendent, options) =>
		fromBooleanE(isUUID(descendent), null, RRR.INVALID_DESCENDENT as const)
			.pipe(chainE(() => MetadataQuery(metadata$).getDescendents(fsid, options)))
			.pipe(mapE(items => items.some(item => item.getFSID() === descendent))),

	hasDescendents: (fsid, options) =>
		MetadataQuery(metadata$)
			.getDescendents(fsid, options)
			.pipe(mapE(items => items.length > 0)),

	total: options =>
		MetadataQuery(metadata$)
			.get(options)
			.pipe(mapE(items => items.length)),
})

export const MetadataCommand = (
	query: TMetadataQuery,
	user: TUserRepository,
): TMetadataCommand => ({
	create: ({
		name,
		parent,
		contentType = "text/ordo",
		fsid = crypto.randomUUID(),
		labels = [],
		links = [],
		properties = {},
	}) =>
		fromBooleanE(isNonEmptyString(name), null, RRR.INVALID_NAME)
			.pipe(chainE(() => fromBooleanE(isValidParent(parent), null, RRR.INVALID_PARENT)))
			.pipe(chainE(() => fromBooleanE(isUUID(fsid), null, RRR.INVALID_FSID)))
			.pipe(chainE(() => fromBooleanE(checkAll(isNonEmptyString, labels), null, RRR.INVALID_LABEL)))
			.pipe(chainE(() => fromBooleanE(checkAll(isUUID, links), null, RRR.INVALID_LINK)))
			.pipe(chainE(() => fromBooleanE(isNonEmptyString(contentType), null, RRR.INVALID_CTYPE)))
			.pipe(chainE(() => fromBooleanE(isObject(properties), null, RRR.INVALID_PROPERTIES)))
			.pipe(chainE(() => query.getByFSID(fsid)))
			.pipe(chainE(item => fromBooleanE(!item, null, RRR.FSID_ALREADY_TAKEN as)))
			.pipe(chainE(() => query.getByNameAndParent(name, parent)))
			.pipe(chainE(item => fromBooleanE(!item, null, RRR.NAME_ALREADY_TAKEN_UNDER_GIVEN_PARENT)))
			.pipe(chainE(() => user.getCurrentUserID()))
			.pipe(mapE(author => ({ time: Date.now(), author })))
			.pipe(
				mapE(({ time, author }) =>
					Metadata({
						fsid,
						name,
						parent,
						contentType,
						labels,
						links,
						properties,
						createdAt: time,
						createdBy: author,
						updatedAt: time,
						updatedBy: author,
						size: 0,
					}),
				),
			)
			.pipe(chainE(metadata => query.get().pipe(mapE(items => items.concat(metadata)))))
			.pipe(mapE(MetadataCommand(query, user).write)),

	write: value => query.metadata$.next(value),

	remove: fsid =>
		fromBooleanE(isUUID(fsid), null, RRR.INVALID_FSID as const)
			.pipe(chainE(() => query.getByFSID(fsid)))
			.pipe(item => fromNullableE(item).pipe(leftMapE(() => RRR.METADATA_NOT_FOUND as const)))
			.pipe(chainE(() => query.get()))
			.pipe(mapE(items => items.filter(item => item.getFSID() === fsid)))
			.pipe(mapE(MetadataCommand(query, user).write)),

	setName: () => null as any,

	setParent: () => null as any,

	setSize: () => null as any,

	addLabels: () => null as any,
	removeLabels: () => null as any,
	replaceLabels: () => null as any,

	addLinks: () => null as any,
	removeLinks: () => null as any,
	replaceLinks: () => null as any,

	appendChildren: () => null as any,
	removeChildren: () => null as any,
	removeProperty: () => null as any,

	setProperty: () => null as any,
})

// --- Internal ---

const U = undefined

const getReadableSize = (size: number, decimals = 2) => {
	if (size <= 0) return "0B"

	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

	const i = Math.floor(Math.log(size) / Math.log(k))

	return `${parseFloat((size / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`
}

const isHidden = (item: TMetadata) => item.getName().startsWith(".")

const hasAllLabels = (labels: string[]) => (item: TMetadata) =>
	labels.every(label => item.getLabels().includes(label))

const isValidParent = (parent: FSID | null) => parent === null || isUUID(parent)

// TODO: Move to tau
const checkAll = <_TParam>(validator: (x: _TParam) => boolean, items: _TParam[]) =>
	items.reduce((acc, item) => acc && validator(item), true)

const negate =
	<_TParam, __TResult>(f: (x: _TParam) => __TResult) =>
	(x: _TParam) =>
		!f(x)
