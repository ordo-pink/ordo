import { chainE, fromNullableE } from "@ordo-pink/either"

import {
	type TCreateMetadataParams,
	type TMetadata,
	type TMetadataDTO,
	type TMetadataProps,
} from "./metadata.types"

export const Metadata = {
	from: <_TProps extends TMetadataProps = TMetadataProps>({
		name,
		parent,
		user,
		type = "text/ordo",
		labels = [],
		links = [],
		props = {} as _TProps,
	}: TCreateMetadataParams<_TProps>): TMetadata<_TProps> =>
		Metadata.of({
			name,
			parent,
			type,
			fsid: crypto.randomUUID(),
			labels,
			links,
			props,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			createdBy: user,
			updatedBy: user,
			size: 0,
		}),
	of: <_TProps_ extends TMetadataProps = TMetadataProps>(
		dto: TMetadataDTO<_TProps_>,
	): TMetadata<_TProps_> => ({
		getFSID: () => dto.fsid,
		getName: () => dto.name,
		getType: () => dto.type,
		getCreatedAt: () => new Date(dto.createdAt),
		getCreatedBy: () => dto.createdBy,
		getUpdatedAt: () => new Date(dto.updatedAt),
		getUpdatedBy: () => dto.updatedBy,
		getLabels: () => dto.labels,
		getLinks: () => [...dto.links],
		getParent: () => dto.parent,
		getProperty: key => fromNullableE(dto.props).pipe(chainE(props => fromNullableE(props[key]))),
		getReadableSize: () => getReadableSize(dto.size),
		getSize: () => dto.size,
		hasLabel: label => dto.labels.includes(label),
		hasLabels: () => dto.labels.length > 0,
		hasLinks: () => dto.links.length > 0,
		hasLinkTo: fsid => dto.links.includes(fsid),
		isChildOf: fsid => dto.parent === fsid,
		isRootChild: () => dto.parent === null,
		toDTO: () => dto,
	}),
}

// --- Internal ---

const getReadableSize = (size: number, decimals = 2) => {
	if (size <= 0) return "0B"

	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

	const i = Math.floor(Math.log(size) / Math.log(k))

	return `${parseFloat((size / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`
}
