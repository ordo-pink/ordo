import { R, type TResult } from "@ordo-pink/result"
import { alpha_sort, concat, override, prop, thunk } from "@ordo-pink/tau"

import { RRR, type TRrr } from "./metadata.errors"
import { type TMetadata, type TMetadataDTO, type TMetadataProps } from "./metadata.types"
import { get_wrong_label, get_wrong_link } from "./metadata.utils"
import { type FSID } from "./data.types"
import { M } from "./metadata.impl"
import { type TMetadataCommandStatic } from "./metadata-command.types"
import { type TMetadataQuery } from "./metadata-query.types"
import { type TUserQuery } from "./user-query.types"

const LOCATION = "MetadataCommand"

const inval = RRR.codes.einval(LOCATION)
const exist = RRR.codes.eexist(LOCATION)
const noent = RRR.codes.enoent(LOCATION)
const enxio = RRR.codes.enxio(LOCATION)

export const MetadataCommand: TMetadataCommandStatic = {
	of: (m_repo, m_query, u_query) => ({
		set_name: (fsid, name) =>
			_check_name_r("set name", name)
				.pipe(R.ops.map(thunk(fsid)))
				.pipe(R.ops.chain(_get_metadata_by_fsid_r("set name", m_query)))
				.pipe(
					R.ops.chain(m =>
						_check_not_exists_by_name_r("set name", m_query, name, m.get_parent()).pipe(
							R.ops.map(thunk(m)),
						),
					),
				)
				.pipe(R.ops.map(_metadata_to_dto))
				.pipe(R.ops.chain(_reset_updated_by_r(u_query)))
				.pipe(R.ops.map(override({ name })))
				.pipe(R.ops.map(_reset_updated_at))
				.pipe(R.ops.map(_dto_to_metadata))
				.pipe(R.ops.chain(MC.of(m_repo, m_query, u_query).replace)),

		set_parent: (fsid, parent) =>
			(parent === null
				? R.Ok<any, any>(null)
				: _get_metadata_by_fsid_r("set parent", m_query)(parent)
			)
				.pipe(R.ops.map(thunk(fsid)))
				.pipe(R.ops.chain(_get_metadata_by_fsid_r("set parent", m_query)))
				.pipe(
					R.ops.chain(m =>
						_check_not_exists_by_name_r("set parent", m_query, m.get_name(), parent).pipe(
							R.ops.map(thunk(m)),
						),
					),
				)
				.pipe(R.ops.chain(_err_on_circular_reference_r(m_query, fsid, parent)))
				.pipe(R.ops.map(_metadata_to_dto))
				.pipe(R.ops.chain(_reset_updated_by_r(u_query)))
				.pipe(R.ops.map(override({ parent })))
				.pipe(R.ops.map(_reset_updated_at))
				.pipe(R.ops.map(_dto_to_metadata))
				.pipe(R.ops.chain(MC.of(m_repo, m_query, u_query).replace)),

		set_size: (fsid, size) =>
			_check_size_r("set size", size)
				.pipe(R.ops.map(thunk(fsid)))
				.pipe(R.ops.chain(_get_metadata_by_fsid_r("set size", m_query)))
				.pipe(R.ops.map(_metadata_to_dto))
				.pipe(R.ops.chain(_reset_updated_by_r(u_query)))
				.pipe(R.ops.map(override({ size })))
				.pipe(R.ops.map(_reset_updated_at))
				.pipe(R.ops.map(_dto_to_metadata))
				.pipe(R.ops.chain(MC.of(m_repo, m_query, u_query).replace)),

		add_labels: (fsid, ...labels) =>
			_get_metadata_by_fsid_r(
				"add labels",
				m_query,
			)(fsid)
				.pipe(R.ops.map(item => item.get_labels()))
				.pipe(R.ops.map(lbls => concat(lbls, labels).sort(alpha_sort("ASC"))))
				.pipe(R.ops.chain(lbls => MC.of(m_repo, m_query, u_query).replace_labels(fsid, lbls))),

		remove_labels: (fsid, ...labels) =>
			_get_metadata_by_fsid_r(
				"remove labels",
				m_query,
			)(fsid)
				.pipe(R.ops.map(item => item.get_labels()))
				.pipe(R.ops.map(lbls => lbls.filter(label => !labels.includes(label))))
				.pipe(R.ops.chain(lbls => MC.of(m_repo, m_query, u_query).replace_labels(fsid, lbls))),

		replace_labels: (fsid, labels) =>
			_check_labels_r("replace labels", labels)
				.pipe(R.ops.map(thunk(fsid)))
				.pipe(R.ops.chain(_get_metadata_by_fsid_r("replace labels", m_query)))
				.pipe(R.ops.map(_metadata_to_dto))
				.pipe(R.ops.chain(_reset_updated_by_r(u_query)))
				.pipe(R.ops.map(override({ labels })))
				.pipe(R.ops.map(_reset_updated_at))
				.pipe(R.ops.map(_dto_to_metadata))
				.pipe(R.ops.chain(MC.of(m_repo, m_query, u_query).replace)),

		add_links: (fsid, ...links) =>
			_get_metadata_by_fsid_r(
				"add links",
				m_query,
			)(fsid)
				.pipe(R.ops.map(item => item.get_links()))
				.pipe(R.ops.map(lnks => concat(lnks, links).sort(alpha_sort())))
				.pipe(R.ops.chain(links => MC.of(m_repo, m_query, u_query).replace_links(fsid, links))),

		remove_links: (fsid, ...links) =>
			_get_metadata_by_fsid_r(
				"remove links",
				m_query,
			)(fsid)
				.pipe(R.ops.map(item => item.get_links()))
				.pipe(R.ops.map(lnks => lnks.filter(link => !links.includes(link))))
				.pipe(R.ops.chain(links => MC.of(m_repo, m_query, u_query).replace_links(fsid, links))),

		replace_links: (fsid, links) =>
			_check_links_r("replace links", links)
				.pipe(R.ops.map(thunk(fsid)))
				.pipe(R.ops.chain(_get_metadata_by_fsid_r("replace links", m_query)))
				.pipe(R.ops.map(_metadata_to_dto))
				.pipe(R.ops.chain(_reset_updated_by_r(u_query)))
				.pipe(R.ops.map(override({ links })))
				.pipe(R.ops.map(_reset_updated_at))
				.pipe(R.ops.map(_dto_to_metadata))
				.pipe(R.ops.chain(MC.of(m_repo, m_query, u_query).replace)),

		append_child: (fsid, child) => MC.of(m_repo, m_query, u_query).set_parent(child, fsid),

		set_property: (fsid, key, value) =>
			_check_prop_key_r("set property", key)
				.pipe(R.ops.map(thunk(fsid)))
				.pipe(R.ops.chain(_get_metadata_by_fsid_r("set property", m_query)))
				.pipe(R.ops.map(_metadata_to_dto))
				.pipe(R.ops.chain(_reset_updated_by_r(u_query)))
				.pipe(R.ops.map(item => ({ ...item, props: { ...(item.props ?? {}), [key]: value } })))
				.pipe(R.ops.map(_reset_updated_at))
				.pipe(R.ops.map(_dto_to_metadata))
				.pipe(R.ops.chain(MC.of(m_repo, m_query, u_query).replace)),

		remove_property: (fsid, key) =>
			_check_prop_key_r("remove property", key)
				.pipe(R.ops.map(thunk(fsid)))
				.pipe(R.ops.chain(_get_metadata_by_fsid_r("remove property", m_query)))
				.pipe(R.ops.map(_metadata_to_dto))
				.pipe(R.ops.chain(_reset_updated_by_r(u_query)))
				.pipe(R.ops.map(item => ({ ...item, props: { ...(item.props ?? {}), [key]: undefined } })))
				.pipe(R.ops.map(_reset_updated_at))
				.pipe(R.ops.map(_dto_to_metadata))
				.pipe(R.ops.chain(MC.of(m_repo, m_query, u_query).replace)),

		create: ({ name, parent, type = "text/ordo", labels = [], links = [], props = {} }) =>
			R.Merge([
				_check_name_r("create", name),
				_check_parent_r("create", parent),
				_check_labels_r("create", labels),
				_check_links_r("create", links),
				_check_type_r("create", type),
				_check_props_r("create", props),
				_check_not_exists_by_name_r("create", m_query, name, parent),
			])
				.pipe(R.ops.chain(u_query.get_current))
				.pipe(R.ops.map(prop("id")))
				.pipe(R.ops.map(id => M.from({ name, parent, author_id: id, type, labels, links, props })))
				.pipe(R.ops.chain(item => m_query.get().pipe(R.ops.map(items => items.concat(item)))))
				.pipe(R.ops.chain(m_repo.put)),

		remove: fsid =>
			_check_fsid_r("remove", fsid)
				.pipe(R.ops.map(thunk(fsid)))
				.pipe(R.ops.chain(_get_metadata_by_fsid_r("remove", m_query)))
				.pipe(R.ops.map(thunk(void 0)))
				.pipe(R.ops.chain(m_query.get))
				.pipe(R.ops.map(items => items.filter(item => item.get_fsid() === fsid)))
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

type TInputValidatorFn<$TInput> = (
	location: string,
	input: $TInput,
) => TResult<boolean, TRrr<"EINVAL">>

const _check_fsid_r: TInputValidatorFn<FSID> = (location, fsid) =>
	R.If(M.guards.is_fsid(fsid), { F: () => inval(`${location} -> fsid: ${fsid}`) })

const _check_size_r: TInputValidatorFn<number> = (location, size) =>
	R.If(M.guards.is_size(size), { F: () => inval(`${location} -> size: ${size}`) })

const _check_parent_r: TInputValidatorFn<FSID | null> = (location, parent) =>
	R.If(M.guards.is_parent(parent), { F: () => inval(`${location} -> parent: ${parent}`) })

const _check_labels_r: TInputValidatorFn<string[]> = (location, labels) =>
	R.If(M.guards.are_labels(labels), {
		F: () => inval(`${location} -> label: ${get_wrong_label(labels)}`),
	})

const _check_name_r: TInputValidatorFn<string> = (location, name) =>
	R.If(M.guards.is_name(name), { F: () => inval(`${location} -> name: ${name}`) })

const _check_links_r: TInputValidatorFn<FSID[]> = (location, links) =>
	R.If(M.guards.are_links(links), {
		F: () => inval(`${location} -> link: ${get_wrong_link(links)}`),
	})

const _check_type_r: TInputValidatorFn<any> = (location, type) =>
	R.If(M.guards.is_type(type), { F: () => inval(`${location} -> type: ${type}`) })

const _check_props_r: TInputValidatorFn<TMetadataProps> = (location, props) =>
	R.If(M.guards.is_props(props), {
		F: () => inval(`${location} -> props: ${JSON.stringify(props)}`),
	})

const _check_prop_key_r: TInputValidatorFn<string | number | symbol> = (location, key) =>
	R.If(M.guards.is_prop_key(key), { F: () => inval(`${location} -> key: ${String(key)}`) })

type TCheckExistsByNameAndParentRFn = (
	location: string,
	metadata_query: TMetadataQuery,
	name: string,
	parent: FSID | null,
) => TResult<void, TRrr<"EEXIST" | "EINVAL" | "EAGAIN">>
const _check_not_exists_by_name_r: TCheckExistsByNameAndParentRFn = (
	location,
	query,
	name,
	parent,
) =>
	query.get_by_name_and_parent(name, parent).pipe(
		R.ops.chain(option =>
			option.cata({
				Some: () => R.Err(exist(`${location} -> ${parent}/${name} exists`)),
				None: () => R.Ok(undefined),
			}),
		),
	)

type TGetMetadataByFSIDRFn = (
	location: string,
	metadata_query: TMetadataQuery,
) => (fsid: FSID) => TResult<TMetadata, TRrr<"ENOENT" | "EAGAIN" | "EINVAL">>
const _get_metadata_by_fsid_r: TGetMetadataByFSIDRFn = (location, query) => fsid =>
	query
		.get_by_fsid(fsid)
		.pipe(
			R.ops.chain(item =>
				item.cata({ Some: R.Ok, None: () => R.Err(inval(`${location} -> fsid: ${fsid}`)) }),
			),
		)

type TResetUpdatedByRFn = (
	user_query: TUserQuery,
) => (dto: TMetadataDTO) => TResult<TMetadataDTO, TRrr<"EAGAIN">>
const _reset_updated_by_r: TResetUpdatedByRFn = query => metadata =>
	query
		.get_current()
		.pipe(R.ops.map(user => user.id))
		.pipe(R.ops.map(updatedBy => ({ ...metadata, updatedBy })))

type TMetadataDTOToTMetadataFn = (dto: TMetadataDTO) => TMetadata
const _dto_to_metadata: TMetadataDTOToTMetadataFn = d => M.of(d)

type TMetadataToTMetadataDTOFn = (metadata: TMetadata) => TMetadataDTO
const _metadata_to_dto: TMetadataToTMetadataDTOFn = m => m.to_dto()

type TResetUpdatedAtFn = (metadata: TMetadataDTO) => TMetadataDTO
const _reset_updated_at: TResetUpdatedAtFn = override({ updated_at: Date.now() })

type TReplaceMetadataRFn = (
	newValue: TMetadata,
) => (items: TMetadata[]) => TResult<TMetadata[], TRrr<"ENOENT">>
const _replace_metadata_r: TReplaceMetadataRFn = x => xs =>
	R.Ok(xs.findIndex(item => item.get_fsid() === x.get_fsid()))
		.pipe(
			R.ops.chain(index =>
				R.If(index >= 0, {
					T: () => ({ items: xs, index: index }),
					F: () => noent(`replace: ${x.get_fsid()} not found`),
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
	metadata_query: TMetadataQuery,
	fsid: FSID,
	parent: FSID | null,
) => (item: TMetadata) => TResult<TMetadata, TRrr<"ENXIO" | "EAGAIN" | "EINVAL" | "ENOENT">>
const _err_on_circular_reference_r: TCheckCircularReferenceRFn =
	(query, fsid, parent) => metadata =>
		query
			.get_descendents(fsid)
			.pipe(
				R.ops.chain(descendents =>
					descendents.some(descendent => descendent.get_fsid() === parent)
						? R.Err(enxio(`circular reference: ${parent} is descendent of ${fsid}`))
						: R.Ok(metadata),
				),
			)