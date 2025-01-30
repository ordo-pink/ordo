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

import { R, type TResult } from "@ordo-pink/result"
import { alpha_sort, concat, override, thunk } from "@ordo-pink/tau"

import { Metadata as M, Metadata, RRR, get_wrong_label, get_wrong_link } from "@ordo-pink/core"

// TODO Move to frontend-app
export const MetadataCommand: Ordo.Metadata.CommandStatic = {
	Of: (m_repo, m_query, u_query) => ({
		set_name: (fsid, name) =>
			_check_name_r("set name", name)
				.pipe(R.ops.map(thunk(fsid)))
				.pipe(R.ops.chain(_get_metadata_by_fsid_r("set name", m_query)))
				.pipe(
					R.ops.chain(m => _check_not_exists_by_name_r("set name", m_query, name, m.get_parent()).pipe(R.ops.map(thunk(m)))),
				)
				.pipe(R.ops.map(_metadata_to_dto))
				.pipe(R.ops.chain(_reset_updated_by_r(u_query)))
				.pipe(R.ops.map(override({ name })))
				.pipe(R.ops.map(_reset_updated_at))
				.pipe(R.ops.map(_dto_to_metadata))
				.pipe(R.ops.chain(MC.Of(m_repo, m_query, u_query).replace)),

		set_parent: (fsid, parent) =>
			(parent === null ? R.Ok<any, any>(null) : _get_metadata_by_fsid_r("set parent", m_query)(parent))
				.pipe(R.ops.map(thunk(fsid)))
				.pipe(R.ops.chain(_get_metadata_by_fsid_r("set parent", m_query)))
				.pipe(
					R.ops.chain(m => _check_not_exists_by_name_r("set parent", m_query, m.get_name(), parent).pipe(R.ops.map(thunk(m)))),
				)
				.pipe(R.ops.chain(_err_on_circular_reference_r(m_query, fsid, parent)))
				.pipe(R.ops.map(_metadata_to_dto))
				.pipe(R.ops.chain(_reset_updated_by_r(u_query)))
				.pipe(R.ops.map(override({ parent })))
				.pipe(R.ops.map(_reset_updated_at))
				.pipe(R.ops.map(_dto_to_metadata))
				.pipe(R.ops.chain(MC.Of(m_repo, m_query, u_query).replace)),

		set_size: (fsid, size) =>
			_check_size_r("set size", size)
				.pipe(R.ops.map(thunk(fsid)))
				.pipe(R.ops.chain(_get_metadata_by_fsid_r("set size", m_query)))
				.pipe(R.ops.map(_metadata_to_dto))
				.pipe(R.ops.chain(_reset_updated_by_r(u_query)))
				.pipe(R.ops.map(override({ size })))
				.pipe(R.ops.map(_reset_updated_at))
				.pipe(R.ops.map(_dto_to_metadata))
				.pipe(R.ops.chain(MC.Of(m_repo, m_query, u_query).replace)),

		add_labels: (fsid, ...labels) =>
			_get_metadata_by_fsid_r(
				"add labels",
				m_query,
			)(fsid)
				.pipe(R.ops.map(item => item.get_labels()))
				.pipe(R.ops.map(lbls => concat(lbls, labels).sort((a, b) => alpha_sort("ASC")(a.name, b.name))))
				.pipe(R.ops.chain(lbls => MC.Of(m_repo, m_query, u_query).replace_labels(fsid, lbls))),

		update_label: (old_label, new_label) =>
			m_query
				.get()
				.pipe(
					R.ops.map(metadata_collection =>
						metadata_collection.map(metadata => {
							if (!metadata.has_label(old_label)) return metadata

							const dto = metadata.to_dto() as any
							const index = metadata.get_label_index(old_label)
							dto.labels = dto.labels.toSpliced(index, 1, new_label)

							return Metadata.FromDTO(dto)
						}),
					),
				)
				.pipe(R.ops.chain(m_repo.put)),

		remove_labels: (fsid, ...labels) =>
			_get_metadata_by_fsid_r(
				"remove labels",
				m_query,
			)(fsid)
				.pipe(R.ops.map(item => item.get_labels()))
				// TODO Fix removing labels
				.pipe(R.ops.map(lbls => lbls.filter(label => !labels.includes(label))))
				.pipe(R.ops.chain(lbls => MC.Of(m_repo, m_query, u_query).replace_labels(fsid, lbls))),

		replace_labels: (fsid, labels) =>
			_check_labels_r("replace labels", labels)
				.pipe(R.ops.map(thunk(fsid)))
				.pipe(R.ops.chain(_get_metadata_by_fsid_r("replace labels", m_query)))
				.pipe(R.ops.map(_metadata_to_dto))
				.pipe(R.ops.chain(_reset_updated_by_r(u_query)))
				.pipe(R.ops.map(override({ labels })))
				.pipe(R.ops.map(_reset_updated_at))
				.pipe(R.ops.map(_dto_to_metadata))
				.pipe(R.ops.chain(MC.Of(m_repo, m_query, u_query).replace)),

		add_links: (fsid, ...links) =>
			_get_metadata_by_fsid_r(
				"add links",
				m_query,
			)(fsid)
				.pipe(R.ops.map(item => item.get_links()))
				.pipe(R.ops.map(lnks => concat(lnks, links).sort(alpha_sort())))
				.pipe(R.ops.chain(links => MC.Of(m_repo, m_query, u_query).replace_links(fsid, links))),

		remove_links: (fsid, ...links) =>
			_get_metadata_by_fsid_r(
				"remove links",
				m_query,
			)(fsid)
				.pipe(R.ops.map(item => item.get_links()))
				.pipe(R.ops.map(lnks => lnks.filter(link => !links.includes(link))))
				.pipe(R.ops.chain(links => MC.Of(m_repo, m_query, u_query).replace_links(fsid, links))),

		replace_links: (fsid, links) =>
			_check_links_r("replace links", links)
				.pipe(R.ops.map(thunk(fsid)))
				.pipe(R.ops.chain(_get_metadata_by_fsid_r("replace links", m_query)))
				.pipe(R.ops.map(_metadata_to_dto))
				.pipe(R.ops.chain(_reset_updated_by_r(u_query)))
				.pipe(R.ops.map(override({ links })))
				.pipe(R.ops.map(_reset_updated_at))
				.pipe(R.ops.map(_dto_to_metadata))
				.pipe(R.ops.chain(MC.Of(m_repo, m_query, u_query).replace)),

		append_child: (fsid, child) => MC.Of(m_repo, m_query, u_query).set_parent(child, fsid),

		set_property: (fsid, key, value) =>
			_check_prop_key_r("set property", key)
				.pipe(R.ops.map(thunk(fsid)))
				.pipe(R.ops.chain(_get_metadata_by_fsid_r("set property", m_query)))
				.pipe(R.ops.map(_metadata_to_dto))
				.pipe(R.ops.chain(_reset_updated_by_r(u_query)))
				.pipe(R.ops.map(item => ({ ...item, props: { ...(item.props ?? {}), [key]: value } })))
				.pipe(R.ops.map(_reset_updated_at))
				.pipe(R.ops.map(_dto_to_metadata))
				.pipe(R.ops.chain(MC.Of(m_repo, m_query, u_query).replace)),

		remove_property: (fsid, key) =>
			_check_prop_key_r("remove property", key)
				.pipe(R.ops.map(thunk(fsid)))
				.pipe(R.ops.chain(_get_metadata_by_fsid_r("remove property", m_query)))
				.pipe(R.ops.map(_metadata_to_dto))
				.pipe(R.ops.chain(_reset_updated_by_r(u_query)))
				.pipe(R.ops.map(item => ({ ...item, props: { ...(item.props ?? {}), [key]: undefined } })))
				.pipe(R.ops.map(_reset_updated_at))
				.pipe(R.ops.map(_dto_to_metadata))
				.pipe(R.ops.chain(MC.Of(m_repo, m_query, u_query).replace)),

		create: ({ name, parent, size, type = "text/ordo", labels = [], links = [], props = {} }) =>
			R.Merge([
				_check_name_r("create", name),
				_check_parent_r("create", parent),
				_check_labels_r("create", labels),
				_check_links_r("create", links),
				_check_type_r("create", type),
				_check_props_r("create", props),
				_check_size_r("create", size ?? 0),
				_check_not_exists_by_name_r("create", m_query, name, parent),
			])
				.pipe(R.ops.chain(u_query.get_current))
				.pipe(R.ops.map(user => user.get_id()))
				.pipe(R.ops.map(author_id => M.Of({ name, parent, author_id, type, labels, links, props, size: size ?? 0 })))
				.pipe(R.ops.chain(item => m_query.get().pipe(R.ops.map(items => items.concat(item)))))
				.pipe(R.ops.chain(m_repo.put)),

		remove: fsid =>
			_check_fsid_r("remove", fsid)
				.pipe(R.ops.map(thunk(fsid)))
				.pipe(R.ops.chain(_get_metadata_by_fsid_r("remove", m_query)))
				.pipe(R.ops.map(thunk(void 0)))
				.pipe(R.ops.chain(() => m_query.get_descendents(fsid, { show_hidden: true })))
				.pipe(R.ops.chain(descendents => m_query.get({ show_hidden: true }).pipe(R.ops.map(all => ({ all, descendents })))))
				.pipe(
					R.ops.map(({ all, descendents }) =>
						all.filter(item => item.get_fsid() !== fsid && !descendents.some(d => d.get_fsid() === item.get_fsid())),
					),
				)
				.pipe(R.ops.chain(m_repo.put)),

		replace: value =>
			m_query
				.get()
				.pipe(R.ops.chain(_replace_metadata_r(value)))
				.pipe(R.ops.chain(m_repo.put)),
	}),
}

export const MC = MetadataCommand

// --- Internal ---

type TInputValidatorFn<$TInput> = (location: string, input: $TInput) => TResult<boolean, Ordo.Rrr<"EINVAL">>

const _check_fsid_r: TInputValidatorFn<Ordo.Metadata.FSID> = (location, fsid) =>
	R.If(M.Validations.is_fsid(fsid), { F: () => RRR.codes.einval(`${location} -> fsid: ${fsid}`) })

const _check_size_r: TInputValidatorFn<number> = (location, size) =>
	R.If(M.Validations.is_size(size), { F: () => RRR.codes.einval(`${location} -> size: ${size}`) })

const _check_parent_r: TInputValidatorFn<Ordo.Metadata.FSID | null> = (location, parent) =>
	R.If(M.Validations.is_parent(parent), { F: () => RRR.codes.einval(`${location} -> parent: ${parent}`) })

const _check_labels_r: TInputValidatorFn<Ordo.Metadata.Label[]> = (location, labels) =>
	R.If(M.Validations.are_labels(labels), {
		F: () => RRR.codes.einval(`${location} -> label`, get_wrong_label(labels)),
	})

const _check_name_r: TInputValidatorFn<string> = (location, name) =>
	R.If(M.Validations.is_name(name), { F: () => RRR.codes.einval(`${location} -> name: ${name}`) })

const _check_links_r: TInputValidatorFn<Ordo.Metadata.FSID[]> = (location, links) =>
	R.If(M.Validations.are_links(links), {
		F: () => RRR.codes.einval(`${location} -> link: ${get_wrong_link(links)}`),
	})

const _check_type_r: TInputValidatorFn<any> = (location, type) =>
	R.If(M.Validations.is_type(type), { F: () => RRR.codes.einval(`${location} -> type: ${type}`) })

const _check_props_r: TInputValidatorFn<Ordo.Metadata.Props> = (location, props) =>
	R.If(M.Validations.is_props(props), {
		F: () => RRR.codes.einval(`${location} -> props: ${JSON.stringify(props)}`),
	})

const _check_prop_key_r: TInputValidatorFn<string | number | symbol> = (location, key) =>
	R.If(M.Validations.is_prop_key(key), { F: () => RRR.codes.einval(`${location} -> key: ${String(key)}`) })

type TCheckExistsByNameAndParentRFn = (
	location: string,
	metadata_query: Ordo.Metadata.Query,
	name: string,
	parent: Ordo.Metadata.FSID | null,
) => TResult<void, Ordo.Rrr<"EPERM" | "EEXIST" | "EINVAL" | "EAGAIN">>
const _check_not_exists_by_name_r: TCheckExistsByNameAndParentRFn = (location, query, name, parent) =>
	query
		.get_by_name(name, parent)
		.pipe(
			R.ops.chain(option => (option ? R.Err(RRR.codes.eexist(`${location} -> ${parent}/${name} exists`)) : R.Ok(undefined))),
		)

type TGetMetadataByFSIDRFn = (
	location: string,
	metadata_query: Ordo.Metadata.Query,
) => (fsid: Ordo.Metadata.FSID) => TResult<Ordo.Metadata.Instance, Ordo.Rrr<"EPERM" | "ENOENT" | "EAGAIN" | "EINVAL">>
const _get_metadata_by_fsid_r: TGetMetadataByFSIDRFn = (location, query) => fsid =>
	query
		.get_by_fsid(fsid)
		.pipe(R.ops.chain(item => (item ? R.Ok(item) : R.Err(RRR.codes.einval(`${location} -> fsid: ${fsid}`)))))

type TResetUpdatedByRFn = (
	user_query: Ordo.User.Query,
) => (dto: Ordo.Metadata.DTO) => TResult<Ordo.Metadata.DTO, Ordo.Rrr<"EPERM" | "EAGAIN">>
const _reset_updated_by_r: TResetUpdatedByRFn = query => metadata =>
	query
		.get_current()
		.pipe(R.ops.map(user => user.get_id()))
		.pipe(R.ops.map(updatedBy => ({ ...metadata, updatedBy })))

type TMetadataDTOToTMetadataFn = (dto: Ordo.Metadata.DTO) => Ordo.Metadata.Instance
const _dto_to_metadata: TMetadataDTOToTMetadataFn = dto => M.FromDTO(dto)

type TMetadataToTMetadataDTOFn = (metadata: Ordo.Metadata.Instance) => Ordo.Metadata.DTO
const _metadata_to_dto: TMetadataToTMetadataDTOFn = m => m.to_dto()

type TResetUpdatedAtFn = (metadata: Ordo.Metadata.DTO) => Ordo.Metadata.DTO
const _reset_updated_at: TResetUpdatedAtFn = metadata => ({ ...metadata, updated_at: Date.now() })

type TReplaceMetadataRFn = (
	newValue: Ordo.Metadata.Instance,
) => (items: Ordo.Metadata.Instance[]) => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"ENOENT">>
const _replace_metadata_r: TReplaceMetadataRFn = x => xs =>
	R.Ok(xs.findIndex(item => item.get_fsid() === x.get_fsid()))
		.pipe(
			R.ops.chain(index =>
				R.If(index >= 0, {
					T: () => ({ items: xs, index: index }),
					F: () => RRR.codes.enoent(`replace: ${x.get_fsid()} not found`),
				}),
			),
		)
		.pipe(
			R.ops.map(({ items, index }) =>
				items
					.slice(0, index)
					.concat(x)
					.concat(items.slice(index + 1)),
			),
		)

type TCheckCircularReferenceRFn = (
	metadata_query: Ordo.Metadata.Query,
	fsid: Ordo.Metadata.FSID,
	parent: Ordo.Metadata.FSID | null,
) => (
	item: Ordo.Metadata.Instance,
) => TResult<Ordo.Metadata.Instance, Ordo.Rrr<"EPERM" | "ENXIO" | "EAGAIN" | "EINVAL" | "ENOENT">>
const _err_on_circular_reference_r: TCheckCircularReferenceRFn = (query, fsid, parent) => metadata =>
	query
		.get_descendents(fsid)
		.pipe(
			R.ops.chain(descendents =>
				descendents.some(descendent => descendent.get_fsid() === parent)
					? R.Err(RRR.codes.enxio(`circular reference: ${parent} is descendent of ${fsid}`))
					: R.Ok(metadata),
			),
		)
