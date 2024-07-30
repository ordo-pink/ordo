// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import * as TAU from "@ordo-pink/tau"

import { type TMetadata, type TMetadataDTO, type TMetadataProps } from "./metadata.types"

export const are_labels = (labels: unknown): labels is TMetadataDTO["labels"] =>
	Array.isArray(labels) && TAU.check_all(is_label, labels)

export const are_links = (links: unknown): links is TMetadataDTO["links"] =>
	Array.isArray(links) && TAU.check_all(is_link, links)

export const is_fsid = (fsid: unknown): fsid is TMetadataDTO["fsid"] => TAU.is_uuid(fsid)

export const is_prop_key = (key: unknown): key is keyof TMetadataDTO["props"] =>
	TAU.is_non_empty_string(key)

export const is_name = (name: unknown): name is TMetadataDTO["name"] =>
	TAU.is_non_empty_string(name)

export const is_size = (size: unknown): size is TMetadataDTO["size"] =>
	TAU.is_finite_non_negative_int(size)

export const is_type = (type: unknown): type is TMetadataDTO["type"] =>
	TAU.is_non_empty_string(type) // TODO: MIME-TYPE

export const is_created_by = (author: unknown): author is TMetadataDTO["created_by"] =>
	TAU.is_uuid(author)

export const is_updated_by = (author: unknown): author is TMetadataDTO["updated_by"] =>
	TAU.is_uuid(author)

export const is_created_at = (timestamp: unknown): timestamp is TMetadataDTO["created_at"] =>
	TAU.is_finite_non_negative_int(timestamp)

export const is_updated_at = (timestamp: unknown): timestamp is TMetadataDTO["updated_at"] =>
	TAU.is_finite_non_negative_int(timestamp)

export const is_props = <$TProps extends TMetadataProps>(props?: $TProps): props is $TProps =>
	props === undefined ||
	TAU.keys_of(props).reduce((acc, key) => acc && is_prop_key(props[key]), true)

export const is_parent = (parent: unknown): parent is TMetadataDTO["parent"] =>
	parent === null || TAU.is_uuid(parent)

export const is_label = (label: unknown): label is TAU.Unpack<TMetadataDTO["labels"]> =>
	TAU.is_non_empty_string(label)

export const is_link = (link: unknown): link is TAU.Unpack<TMetadataDTO["links"]> =>
	TAU.is_uuid(link)

export const is_metadata = (x: unknown): x is TMetadata => {
	if (!TAU.is_object(x)) return false

	const y = x as TMetadata

	return (
		TAU.is_fn(y.get_created_at) &&
		TAU.is_fn(y.get_created_by) &&
		TAU.is_fn(y.get_fsid) &&
		TAU.is_fn(y.get_labels) &&
		TAU.is_fn(y.get_links) &&
		TAU.is_fn(y.get_name) &&
		TAU.is_fn(y.get_parent) &&
		TAU.is_fn(y.get_property) &&
		TAU.is_fn(y.get_readable_size) &&
		TAU.is_fn(y.get_size) &&
		TAU.is_fn(y.get_type) &&
		TAU.is_fn(y.get_updated_at) &&
		TAU.is_fn(y.get_updated_by) &&
		TAU.is_fn(y.has_label) &&
		TAU.is_fn(y.has_labels) &&
		TAU.is_fn(y.has_link_to) &&
		TAU.is_fn(y.has_links) &&
		TAU.is_fn(y.is_child_of) &&
		TAU.is_fn(y.is_root_child) &&
		TAU.is_fn(y.to_dto) &&
		is_metadata_dto(y.to_dto())
	)
}

export const is_metadata_dto = (x: unknown): x is TMetadataDTO => {
	if (!TAU.is_object(x)) return false

	const y = x as TMetadataDTO

	return (
		is_created_at(y.created_at) &&
		is_created_by(y.created_by) &&
		is_fsid(y.fsid) &&
		are_labels(y.labels) &&
		are_links(y.links) &&
		is_name(y.name) &&
		is_parent(y.parent) &&
		is_props(y.props) &&
		is_size(y.size) &&
		is_type(y.type) &&
		is_created_at(y.updated_at) &&
		is_created_by(y.updated_by)
	)
}

export const MetadataValidations = {
	is_metadata,
	is_metadata_dto,
	is_created_at,
	is_created_by,
	is_updated_at,
	is_updated_by,
	is_fsid,
	is_label,
	is_link,
	is_name,
	is_parent,
	is_prop_key,
	is_props,
	is_size,
	is_type,
	are_labels,
	are_links,
}
