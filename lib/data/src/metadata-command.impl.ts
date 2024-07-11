import { R, type TResult } from "@ordo-pink/result"
import { alphaSort, concat, isObject, isUUID, override } from "@ordo-pink/tau"

import { RRR, TRrr } from "./metadata.errors"
import { type TMetadata, type TMetadataDTO, type TMetadataProps } from "./metadata.types"
import {
	are_lbls,
	are_lnks,
	is_name,
	is_parent,
	is_prop_key,
	is_size,
	is_type,
} from "./metadata-validations"
import { get_wrong_label, get_wrong_link } from "./metadata.utils"
import { type FSID } from "./data.types"
import { M } from "./metadata.impl"
import { type TMetadataCommandStatic } from "./metadata-command.types"
import { type TMetadataQuery } from "./metadata-query.types"
import { type TUserQuery } from "./user-query.types"

const LOCATION = "MetadataCommand"

const einval = RRR.codes.einval(LOCATION)
const eexist = RRR.codes.eexist(LOCATION)
const enoent = RRR.codes.enoent(LOCATION)
const enxio = RRR.codes.enxio(LOCATION)

export const MetadataCommand: TMetadataCommandStatic = {
	of: (m_repo, m_query, u_query) => ({
		create: ({ name, parent, type = "text/ordo", labels = [], links = [], props = {} }) =>
			R.Merge([
				R.If(is_name(name), { F: () => einval(`.create name: ${name}`) }),
				R.If(is_parent(parent), { F: () => einval(`.create -> parent: ${parent}`) }),
				R.If(are_lbls(labels), { F: () => einval(`.create -> lbl: ${get_wrong_label(labels)}`) }),
				R.If(are_lnks(links), { F: () => einval(`.create -> link: ${get_wrong_link(links)}`) }),
				R.If(is_type(type), { F: () => einval(`.create -> type: ${type}`) }),
				R.If(isObject(props), { F: () => einval(`.create -> props: ${JSON.stringify(props)}`) }),
			])
				.pipe(R.ops.chain(() => m_query.get_by_name_and_parent(name, parent)))
				.pipe(
					R.ops.chain(option =>
						option.cata({
							Some: () => R.Err(eexist(`.create -> ${parent}/${name}`)),
							None: () => R.Ok(null),
						}),
					),
				)
				.pipe(R.ops.chain(() => u_query.get_current()))
				.pipe(R.ops.map(user => user.id))
				.pipe(R.ops.map(id => M.from({ name, parent, author_id: id, type, labels, links, props })))
				.pipe(R.ops.chain(item => m_query.get().pipe(R.ops.map(items => items.concat(item)))))
				.pipe(R.ops.chain(m_repo.put)),

		remove: fsid =>
			R.If(isUUID(fsid), { T: () => fsid, F: () => einval(`.remove -> fsid: ${fsid}`) })
				.pipe(R.ops.chain(_getMetadataIfExistsR(m_query)))
				.pipe(R.ops.chain(() => m_query.get()))
				.pipe(R.ops.map(items => items.filter(item => item.get_fsid() === fsid)))
				.pipe(R.ops.chain(m_repo.put)),

		set_name: (fsid, name) =>
			R.If(is_name(name), { T: () => fsid, F: () => einval(`.setName -> name: ${name}`) })
				.pipe(R.ops.chain(_getMetadataIfExistsR(m_query)))
				.pipe(R.ops.chain(_rejectIfMetadataExistsByNameParentR(m_query)))
				.pipe(R.ops.map(_toMetadataDTO))
				.pipe(R.ops.chain(_resetUpdatedByR(u_query)))
				.pipe(R.ops.map(override({ name })))
				.pipe(R.ops.map(_resetUpdatedAt))
				.pipe(R.ops.map(M.of))
				.pipe(R.ops.chain(MC.of(m_repo, m_query, u_query).replace)),

		set_parent: (fsid, parent) =>
			(parent === null ? R.Ok<any, any>(null) : _getMetadataIfExistsR(m_query)(parent))
				.pipe(R.ops.map(() => fsid))
				.pipe(R.ops.chain(_getMetadataIfExistsR(m_query)))
				.pipe(R.ops.chain(_rejectIfMetadataExistsByNameParentR(m_query)))
				.pipe(R.ops.chain(_checkCircularReferenceR(m_query, fsid, parent)))
				.pipe(R.ops.map(_toMetadataDTO))
				.pipe(R.ops.chain(_resetUpdatedByR(u_query)))
				.pipe(R.ops.map(override({ parent })))
				.pipe(R.ops.map(_resetUpdatedAt))
				.pipe(R.ops.map(M.of))
				.pipe(R.ops.chain(MC.of(m_repo, m_query, u_query).replace)),

		set_size: (fsid, size) =>
			R.If(is_size(size), { T: () => fsid, F: () => einval(`.setSize -> size: ${size}`) })
				.pipe(R.ops.chain(_getMetadataIfExistsR(m_query)))
				.pipe(R.ops.map(_toMetadataDTO))
				.pipe(R.ops.chain(_resetUpdatedByR(u_query)))
				.pipe(R.ops.map(override({ size })))
				.pipe(R.ops.map(_resetUpdatedAt))
				.pipe(R.ops.map(M.of))
				.pipe(R.ops.chain(MC.of(m_repo, m_query, u_query).replace)),

		add_labels: (fsid, ...labels) =>
			_getMetadataIfExistsR(m_query)(fsid)
				.pipe(R.ops.map(item => item.get_labels()))
				.pipe(R.ops.map(lbls => concat(lbls, labels).sort(alphaSort("ASC"))))
				.pipe(R.ops.chain(lbls => MC.of(m_repo, m_query, u_query).replace_labels(fsid, lbls))),

		remove_labels: (fsid, ...labels) =>
			_getMetadataIfExistsR(m_query)(fsid)
				.pipe(R.ops.map(item => item.get_labels()))
				.pipe(R.ops.map(lbls => lbls.filter(label => !labels.includes(label))))
				.pipe(R.ops.chain(lbls => MC.of(m_repo, m_query, u_query).replace_labels(fsid, lbls))),

		replace_labels: (fsid, labels) =>
			R.If(are_lbls(labels))
				.pipe(R.ops.err_map(() => einval(`.replaceLabels -> label: ${get_wrong_label(labels)}`)))
				.pipe(R.ops.map(() => fsid))
				.pipe(R.ops.chain(_getMetadataIfExistsR(m_query)))
				.pipe(R.ops.map(_toMetadataDTO))
				.pipe(R.ops.chain(_resetUpdatedByR(u_query)))
				.pipe(R.ops.map(override({ labels })))
				.pipe(R.ops.map(_resetUpdatedAt))
				.pipe(R.ops.map(M.of))
				.pipe(R.ops.chain(MC.of(m_repo, m_query, u_query).replace)),

		add_links: (fsid, ...links) =>
			_getMetadataIfExistsR(m_query)(fsid)
				.pipe(R.ops.map(item => item.get_links()))
				.pipe(R.ops.map(lnks => concat(lnks, links).sort(alphaSort())))
				.pipe(R.ops.chain(links => MC.of(m_repo, m_query, u_query).replace_links(fsid, links))),

		remove_links: (fsid, ...links) =>
			_getMetadataIfExistsR(m_query)(fsid)
				.pipe(R.ops.map(item => item.get_links()))
				.pipe(R.ops.map(lnks => lnks.filter(link => !links.includes(link))))
				.pipe(R.ops.chain(links => MC.of(m_repo, m_query, u_query).replace_links(fsid, links))),

		replace_links: (fsid, links) =>
			R.If(are_lnks(links))
				.pipe(R.ops.err_map(() => einval(`.replaceLinks -> link: ${links.find(l => !isUUID(l))}`)))
				.pipe(R.ops.map(() => fsid))
				.pipe(R.ops.chain(_getMetadataIfExistsR(m_query)))
				.pipe(R.ops.map(_toMetadataDTO))
				.pipe(R.ops.chain(_resetUpdatedByR(u_query)))
				.pipe(R.ops.map(override({ links })))
				.pipe(R.ops.map(_resetUpdatedAt))
				.pipe(R.ops.map(M.of))
				.pipe(R.ops.chain(MC.of(m_repo, m_query, u_query).replace)),

		append_child: (fsid, child) => MC.of(m_repo, m_query, u_query).set_parent(child, fsid),

		set_property: (fsid, key, value) =>
			R.If(is_prop_key(key), { F: () => einval(`.setProperty -> key: ${key.toString()}`) })
				.pipe(R.ops.map(() => fsid))
				.pipe(R.ops.chain(_getMetadataIfExistsR(m_query)))
				.pipe(R.ops.map(_toMetadataDTO))
				.pipe(R.ops.chain(_resetUpdatedByR(u_query)))
				.pipe(R.ops.map(item => ({ ...item, props: { ...(item.props ?? {}), [key]: value } })))
				.pipe(R.ops.map(_resetUpdatedAt))
				.pipe(R.ops.map(M.of))
				.pipe(R.ops.chain(MC.of(m_repo, m_query, u_query).replace)),

		remove_property: (fsid, key) =>
			R.If(is_prop_key(key), { F: () => einval(`.removeProperty -> key: ${key.toString()}`) })
				.pipe(R.ops.map(() => fsid))
				.pipe(R.ops.chain(_getMetadataIfExistsR(m_query)))
				.pipe(R.ops.map(_toMetadataDTO))
				.pipe(R.ops.chain(_resetUpdatedByR(u_query)))
				.pipe(R.ops.map(item => ({ ...item, props: { ...(item.props ?? {}), [key]: undefined } })))
				.pipe(R.ops.map(_resetUpdatedAt))
				.pipe(R.ops.map(M.of))
				.pipe(R.ops.chain(MC.of(m_repo, m_query, u_query).replace)),

		replace: value =>
			m_query
				.get()
				.pipe(R.ops.chain(_replaceMetadataR(value)))
				.pipe(R.ops.chain(m_repo.put)),
	}),
}

export const MC = MetadataCommand

// --- Internal ---

const _getMetadataIfExistsR =
	(metadataQuery: TMetadataQuery) =>
	(fsid: FSID): TResult<TMetadata, TRrr<"ENOENT" | "EAGAIN" | "EINVAL">> =>
		metadataQuery
			.get_by_fsid(fsid)
			.pipe(
				R.ops.chain(item =>
					item.cata({ Some: R.Ok, None: () => R.Err(einval(`_getMetadataIfExistsR: ${fsid}`)) }),
				),
			)

const _resetUpdatedByR = (userQuery: TUserQuery) => (item: TMetadataDTO) =>
	userQuery
		.get_current()
		.pipe(R.ops.map(user => user.id))
		.pipe(R.ops.map(updatedBy => ({ ...item, updatedBy })))

type TRejectIfMetadataExistsByNameParentRFn = (
	metadataQuery: TMetadataQuery,
) => (metadata: TMetadata) => TResult<TMetadata, TRrr<"EEXIST">>
const _rejectIfMetadataExistsByNameParentR: TRejectIfMetadataExistsByNameParentRFn = q => m =>
	q
		.get_by_name_and_parent(m.get_name(), m.get_parent())
		.pipe(R.ops.swap())
		.pipe(
			R.ops.bimap(
				() => eexist(`_rejectIfMetadataExistsByNameParentR: ${m.get_name()}, ${m.get_parent()}`),
				() => m,
			),
		)

type TToMetadataDTOFn = <_TProps extends TMetadataProps = TMetadataProps>(
	metadata: TMetadata<_TProps>,
) => TMetadataDTO<_TProps>
const _toMetadataDTO: TToMetadataDTOFn = x => x.to_dto()

type TResetUpdatedAtFn = (metadata: TMetadataDTO) => TMetadataDTO
const _resetUpdatedAt: TResetUpdatedAtFn = override({ updated_at: Date.now() })

type TReplaceMetadataRFn = (
	newValue: TMetadata,
) => (items: TMetadata[]) => TResult<TMetadata[], TRrr<"ENOENT">>
const _replaceMetadataR: TReplaceMetadataRFn = x => xs =>
	R.Ok(xs.findIndex(item => item.get_fsid() === x.get_fsid()))
		.pipe(
			R.ops.chain(index =>
				R.If(index >= 0, {
					T: () => ({ items: xs, index: index }),
					F: () => enoent(`_replaceMetadataR: ${x.get_fsid()} not in metadata`),
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

export type TCheckCircularReferenceRFn = (
	mQuery: TMetadataQuery,
	fsid: FSID,
	parent: FSID | null,
) => (item: TMetadata) => TResult<TMetadata, TRrr<"ENXIO" | "EAGAIN" | "EINVAL" | "ENOENT">>
export const _checkCircularReferenceR: TCheckCircularReferenceRFn = (mQuery, id, p) => i =>
	mQuery
		.get_descendents(id)
		.pipe(
			R.ops.chain(ds =>
				ds.some(d => d.get_fsid() === p)
					? R.Err(enxio(`.setParent circular reference: ${p} is in children of ${id}`))
					: R.Ok(i),
			),
		)
