/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { CoreSDK } from "../core/core.types"
import type { CoreMixins } from "../mixins/mixins.types"
import { DATA } from "./data.constants"
import type { Data } from "./data.types"
import { core_sdk } from "../core/core.impl"
import { core_mixins } from "../mixins/mixins.impl"
import { data } from "./data.impl"

// TODO
export namespace data_mixins {
	export const childish: CoreSDK.Mixin<Data.CustomMixins.Childish.Interface> = {
		instance: plain => ({
			get_parent: () => plain.parent,
			is_child_of: id => !!id && plain.parent === id,
			is_root_child: () => !parent,
		}),
		static: {},
		validations: {
			...core_mixins.identifiable.validations,
			is_parent: (x): x is Data.CustomMixins.Childish.Parent => x === null || data_mixins.childish.validations.is_id(x),
		},
	}

	export const contentful: CoreSDK.Mixin<Data.CustomMixins.Contentful.Interface> = {
		instance: plain => ({
			get_content_type: () => plain.type,
			get_readable_size: () => data_mixins.contentful.static.to_readable_size(plain.size),
			get_size: () => plain.size,
			has_content_type: type => plain.type === type,
		}),
		static: {
			get_default_content_type: () => "application/octet-stream",
			get_default_size: () => 0,
			to_readable_size: (size: number) => {
				if (size <= 0) return "0B"

				const k = Math.log(1024)
				const fraction_digits = 2
				const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

				const size_index = Math.floor(Math.log(size) / k)
				const readable_size_value = parseFloat((size / Math.pow(k, size_index)).toFixed(fraction_digits))
				const size_text = sizes[size_index]

				return `${readable_size_value}${size_text}`
			},
		},
		validations: {
			is_content_type: (x): x is Data.CustomMixins.Contentful.ContentType => core_sdk.validations.is_string(x),
			is_size: (x): x is Data.CustomMixins.Contentful.Size => core_sdk.validations.is_finite_non_negative_int(x),
		},
	}

	export const creatable: CoreSDK.Mixin<CoreMixins.Creatable.Interface<Data.CreateParams, Data.Interface>> = {
		instance: () => ({}),
		static: {
			new: (name, author, parent, content_type, size, persistence_location, links, tags, extensions, id) => {
				const created_at = data.create_timestamp()

				return data.from_dto(
					id ?? data.create_id(),
					created_at,
					created_at,
					author,
					author,
					name,
					parent ?? null,
					content_type ?? data.get_default_content_type(),
					size ?? data.get_default_size(),
					persistence_location ?? data.get_default_persistence_location(),
					links ?? [],
					tags ?? [],
					extensions ?? {},
					author,
					{},
				)
			},
		},
		validations: {},
	}

	export const linkable: CoreSDK.Mixin<Data.CustomMixins.Linkable.Interface> = {
		instance: plain => ({
			get_links: () => plain.links,
			has_every_link: (...links) => links.every(link => plain.links.includes(link)),
			has_links: () => plain.links.length > 0,
			has_no_links: (...links) => !links.some(link => plain.links.includes(link)),
			has_some_links: (...links) => links.some(link => plain.links.includes(link)),
			get links_length() {
				return plain.links.length
			},
		}),
		static: {
			get_default_links: () => [],
		},
		validations: {
			...core_mixins.identifiable.validations,
			is_links: (x): x is Data.CustomMixins.Linkable.Link[] =>
				core_sdk.validations.is_array(x) && x.every(linkable.validations.is_id),
		},
	}

	export const taggable: CoreSDK.Mixin<Data.CustomMixins.Taggable.Interface> = {
		instance: plain => ({
			get_tags: () => plain.tags,
			get_tags_by_colors: (...colors) => plain.tags.filter(tag => colors.includes(tag[0])),
			has_every_tag: (...tags) => tags.every(tag => plain.tags.some(t => t[0] === tag[0] && t[1] === tag[1])),
			has_tags: () => plain.tags.length > 0,
			has_none_of_tags: (...tags) => !tags.some(tag => plain.tags.some(t => t[0] === tag[0] && t[1] === tag[1])),
			has_some_tags: (...tags) => tags.some(tag => plain.tags.some(t => t[0] === tag[0] && t[1] === tag[1])),

			get tags_length() {
				return plain.tags.length
			},
		}),

		static: {
			create_tag: (value, color = taggable.static.DEFAULT_TAG_COLOR) => [color, value],
			DEFAULT_TAG_COLOR: DATA.TAG_COLOR.GRAY,
		},
		validations: {
			is_tag: (x): x is Data.CustomMixins.Taggable.Tag =>
				core_sdk.validations.is_array(x) &&
				taggable.validations.is_tag_color(x[0]) &&
				core_sdk.validations.is_non_empty_string(x[1]),
			is_tag_color: (x): x is Data.CustomMixins.Taggable.TagColor =>
				core_sdk.validations.is_finite_non_negative_int(x) && x < Number(DATA.TAG_COLOR.length),
		},
	}

	export const serializable: CoreSDK.Mixin<CoreMixins.Serializable.Interface<Data.DTO, Data.Interface>> = {
		instance: plain => ({
			to_dto: () => [
				plain.id,
				plain.created_at,
				plain.updated_at,
				plain.created_by,
				plain.updated_by,
				plain.name,
				plain.parent,
				plain.type,
				plain.size,
				plain.persistence_location,
				plain.links,
				plain.tags,
				plain.extensions,
				plain.owner,
				plain.permissions,
			],
		}),
		static: {
			from_dto: (...dto) => {
				const plain: Data.Interface["Plain"] = {
					created_at: dto[1],
					created_by: dto[3],
					extensions: dto[12],
					id: dto[0],
					links: dto[10],
					name: dto[5],
					owner: dto[13],
					parent: dto[6],
					permissions: dto[14],
					persistence_location: dto[9],
					size: dto[8],
					tags: dto[11],
					type: dto[7],
					updated_at: dto[2],
					updated_by: dto[4],
				}

				// TODO
				return {
					...core_mixins.identifiable.instance(plain),
					...core_mixins.authored.with_updates.instance(plain),
					...core_mixins.extendable.instance(plain),
					...core_mixins.named.instance(plain),
					...core_mixins.timestampable.with_updates.instance(plain),
					...data_mixins.childish.instance(plain),
					...data_mixins.contentful.instance(plain),
					...data_mixins.creatable.instance(plain),
					...data_mixins.serializable.instance(plain),
					...data_mixins.linkable.instance(plain),
					...data_mixins.taggable.instance(plain),
					...data_mixins.persistable.instance(plain),
					...data_mixins.accessible.instance(plain),
				}
			},
		},
		// TODO
		validations: {
			is_dto: (x): x is Data.DTO => {
				if (!core_sdk.validations.is_array(x)) return false

				const dto = x as Data.DTO

				return (
					core_mixins.identifiable.validations.is_id(dto[0]) &&
					core_mixins.timestampable.without_updates.validations.is_timestamp(dto[1]) &&
					core_mixins.named.validations.is_name(dto[4])
				)
			},
		},
	}

	export const persistable: CoreSDK.Mixin<Data.CustomMixins.Persistable.Interface> = {
		instance: plain => ({
			get_persistence_location: () => plain.persistence_location,
			should_persist_locally: () =>
				plain.persistence_location === DATA.PERSISTENCE_LOCATION.LOCAL_ONLY ||
				plain.persistence_location === DATA.PERSISTENCE_LOCATION.DEFAULT,
			should_persist_remotely: () =>
				plain.persistence_location === DATA.PERSISTENCE_LOCATION.REMOTE_ONLY ||
				plain.persistence_location === DATA.PERSISTENCE_LOCATION.DEFAULT,
		}),
		static: {
			PERSISTENCE_LOCATION: DATA.PERSISTENCE_LOCATION,
			get_default_persistence_location: () => DATA.PERSISTENCE_LOCATION.DEFAULT,
		},
		validations: {
			is_persistence_location: (x): x is Data.CustomMixins.Persistable.Location =>
				core_sdk.validations.is_finite_non_negative_int(x) && x < Number(DATA.PERSISTENCE_LOCATION.length),
		},
	}

	export const accessible: CoreSDK.Mixin<Data.CustomMixins.Accessible.Interface> = {
		instance: plain => ({
			can_exec: id => DATA.PERMISSION[plain.permissions[id]].includes("X"),
			can_read: id => DATA.PERMISSION[plain.permissions[id]].includes("R"),
			can_write: id => DATA.PERMISSION[plain.permissions[id]].includes("W"),
			get_owner: () => plain.owner,
			get_permissions: () => plain.permissions,
		}),
		static: {
			PERMISSION: DATA.PERMISSION,
			get_default_permission: () => DATA.PERMISSION.___,
			get_default_permissions: () => ({}),
		},
		validations: {
			...core_mixins.identifiable.validations,
			is_permission: (x): x is Data.CustomMixins.Accessible.Permission =>
				core_sdk.validations.is_finite_non_negative_int(x) && x < Number(DATA.PERMISSION.length),
			is_permissions: (x): x is Data.CustomMixins.Accessible.Permissions => core_sdk.validations.is_object(x),
		},
	}
}
