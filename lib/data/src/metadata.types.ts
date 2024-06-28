import type { TEither } from "@ordo-pink/either"

import type { FSID, UserID } from "./data.types"

export type TMetadataProps = Readonly<Record<string, any>>

export type TCreateMetadataParams<_TProps extends TMetadataProps = TMetadataProps> = Partial<
	Omit<
		TMetadataDTO<_TProps>,
		"createdBy" | "createdAt" | "size" | "updatedAt" | "updatedBy" | "fsid"
	>
> &
	Pick<TMetadataDTO<_TProps>, "name" | "parent"> & { user: UserID }

export type TMetadataDTO<_TProps extends TMetadataProps = TMetadataProps> = Readonly<{
	fsid: FSID
	name: string
	parent: FSID | null
	links: FSID[]
	labels: string[]
	type: string
	createdAt: number
	createdBy: UserID
	updatedAt: number
	updatedBy: UserID
	size: number
	props?: _TProps
}>

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
	getType: () => string
	getCreatedAt: () => Date
	getCreatedBy: () => UserID
	getUpdatedAt: () => Date
	getUpdatedBy: () => UserID
	getSize: () => number
	getReadableSize: () => string
	getProperty: <_TKey_ extends keyof _TProps>(key: _TKey_) => TEither<_TProps[_TKey_], null>
	toDTO: () => TMetadataDTO<_TProps>
}
