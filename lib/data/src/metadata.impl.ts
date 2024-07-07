import { O } from "@ordo-pink/option"

import { type TMetadataStatic } from "./metadata.types"

export const Metadata: TMetadataStatic = {
	from: ({ name, parent, user, type = "text/ordo", labels = [], links = [], props = {} as any }) =>
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
	of: dto => ({
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
		getProperty: key =>
			O.fromNullable(dto.props).cata({
				Some: props => (key in props ? O.some(props[key]) : O.none()),
				None: () => O.none(),
			}),
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
