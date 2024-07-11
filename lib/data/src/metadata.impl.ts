import { O } from "@ordo-pink/option"

import { MetadataGuards } from "./metadata-validations"
import { type TMetadataStatic } from "./metadata.types"

export const Metadata: TMetadataStatic = {
	from: ({
		name,
		parent,
		author_id: user,
		type = "text/ordo",
		labels = [],
		links = [],
		props = {} as any,
	}) =>
		Metadata.of({
			name,
			parent,
			type,
			fsid: crypto.randomUUID(),
			labels,
			links,
			props,
			created_at: Date.now(),
			updated_at: Date.now(),
			created_by: user,
			updated_by: user,
			size: 0,
		}),
	of: dto => ({
		get_fsid: () => dto.fsid,
		get_name: () => dto.name,
		get_type: () => dto.type,
		get_created_at: () => new Date(dto.created_at),
		get_created_by: () => dto.created_by,
		get_updated_at: () => new Date(dto.updated_at),
		get_updated_by: () => dto.updated_by,
		get_labels: () => dto.labels,
		get_links: () => [...dto.links],
		get_parent: () => dto.parent,
		get_property: key =>
			O.FromNullable(dto.props).cata({
				Some: props => (key in props ? O.Some(props[key]) : O.None()),
				None: () => O.None(),
			}),
		get_readable_size: () => get_readable_size(dto.size),
		get_size: () => dto.size,
		has_label: label => dto.labels.includes(label),
		has_labels: () => dto.labels.length > 0,
		has_links: () => dto.links.length > 0,
		has_link_to: fsid => dto.links.includes(fsid),
		is_child_of: fsid => dto.parent === fsid,
		is_root_child: () => dto.parent === null,
		to_dto: () => dto,
		is_hidden: () => dto.name.startsWith("."),
	}),
	guards: MetadataGuards,
}

export const M = Metadata

// --- Internal ---

const get_readable_size = (size: number, decimals = 2) => {
	if (size <= 0) return "0B"

	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

	const i = Math.floor(Math.log(size) / Math.log(k))

	return `${parseFloat((size / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`
}
