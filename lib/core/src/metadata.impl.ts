/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { F, is_string } from "@ordo-pink/tau"
import { Switch } from "@ordo-pink/switch"

import { MetadataValidations } from "./metadata-validations.impl"

export const Metadata: Ordo.Metadata.Static = {
	Of: ({ name, parent, author_id: user, type = "text/ordo", labels = [], links = [], props = {} as any, size = 0 }) =>
		Metadata.FromDTO({
			fsid: crypto.randomUUID(),
			created_at: Date.now(),
			updated_at: Date.now(),
			created_by: user,
			updated_by: user,
			name,
			parent,
			type,
			labels,
			links,
			props,
			size,
		}),
	FromDTO: dto => ({
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
		get_property: key => dto.props?.[key] ?? null,
		get_readable_size: () => get_readable_size(dto.size),
		get_label_index: label =>
			dto.labels.findIndex(x =>
				is_string(label) ? x === label : !is_string(x) && x.color === label.color && x.name === label.name,
			),
		get_size: () => dto.size,
		has_label: label => Metadata.FromDTO(dto).get_label_index(label) >= 0,
		has_labels: () => dto.labels.length > 0,
		has_links: () => dto.links.length > 0,
		has_link_to: fsid => dto.links.includes(fsid),
		is_child_of: fsid => dto.parent === fsid,
		is_root_child: () => dto.parent === null,
		to_dto: () => dto,
		is_hidden: () => dto.name.startsWith("."),
		equals: o => {
			if (!Metadata.Validations.is_metadata(o)) return false

			const o_dto = o.to_dto()

			return Switch.OfTrue()
				.case(o_dto.fsid !== dto.fsid, F)
				.case(o_dto.updated_at !== dto.updated_at, F)
				.default(
					() =>
						o_dto.created_at === dto.created_at && o_dto.created_by === dto.created_by && o_dto.updated_by === dto.updated_by,
				)
		},
		is_item_of: o => Metadata.Validations.is_metadata_dto(o) && Metadata.FromDTO(o).equals(Metadata.FromDTO(dto)),
	}),
	Validations: MetadataValidations,
}

// --- Internal ---

const get_readable_size = (size: number, decimals = 2) => {
	if (size <= 0) return "0B"

	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

	const i = Math.floor(Math.log(size) / Math.log(k))

	return `${parseFloat((size / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`
}
