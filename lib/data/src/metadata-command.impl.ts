import { R, type TResult } from "@ordo-pink/result"
import { alphaSort, concat, isNonEmptyString, isObject, isUUID, override } from "@ordo-pink/tau"

import { RRR, TRrr, enxio } from "./metadata.errors"
import { type TMetadata, type TMetadataDTO, type TMetadataProps } from "./metadata.types"
import { areLabels, areLinks, isName, isSize, isType, isParent } from "./metadata-validations"
import { type FSID } from "./data.types"
import { Metadata } from "./metadata.impl"
import { type TMetadataCommandStatic } from "./metadata-command.types"
import { type TMetadataQuery } from "./metadata-query.types"
import { type TUserQuery } from "./metadata-repository.types"

const LOCATION = "MetadataCommand"

const einval = RRR.codes.einval(LOCATION)
const eexist = RRR.codes.eexist(LOCATION)
const enoent = RRR.codes.enoent(LOCATION)

// TODO: Check permissions
// TODO: Audit
export const MetadataCommand: TMetadataCommandStatic = {
	of: (mQuery, uQuery) => ({
		create: ({ name, parent, type = "text/ordo", labels = [], links = [], props = {} }) =>
			R.if(isName(name), { onF: () => einval(`.create name: ${name}`) })
				.pipe(
					R.ops.chain(() =>
						R.if(isParent(parent), { onF: () => einval(`.create parent: ${parent}`) }),
					),
				)
				.pipe(
					R.ops.chain(() =>
						R.if(areLabels(labels), {
							onF: () => einval(`.create label: ${labels.find(l => !isNonEmptyString(l))}`),
						}),
					),
				)
				.pipe(
					R.ops.chain(() =>
						R.if(areLinks(links), {
							onF: () => einval(`.create link: ${links.find(l => !isUUID(l))}`),
						}),
					),
				)
				.pipe(R.ops.chain(() => R.if(isType(type), { onF: () => einval(`.create type: ${type}`) })))
				.pipe(
					R.ops.chain(() =>
						R.if(isObject(props), { onF: () => einval(`.create props: ${props}`) }),
					),
				)
				.pipe(R.ops.chain(() => mQuery.getByNameAndParent(name, parent)))
				.pipe(
					R.ops.chain(option =>
						option.cata({
							Some: item => R.rrr(eexist(`.create: ${item.getFSID()}`)),
							None: () => R.ok(null),
						}),
					),
				)
				.pipe(R.ops.chain(() => uQuery.getCurrentUserID()))
				.pipe(R.ops.map(user => Metadata.from({ name, parent, user, type, labels, links, props })))
				.pipe(
					R.ops.chain(item =>
						mQuery
							.get()
							.pipe(
								R.ops.map(option =>
									option.cata({ Some: items => items.concat(item), None: () => [item] }),
								),
							),
					),
				)
				.pipe(R.ops.chain(mQuery.metadataRepository.put)),

		// TODO: Move add/remove to metadata$
		remove: fsid =>
			R.if(isUUID(fsid), { onT: () => fsid, onF: () => einval(`.remove fsid: ${fsid}`) })
				.pipe(R.ops.chain(_getMetadataIfExistsR(mQuery)))
				.pipe(R.ops.chain(() => mQuery.get()))
				.pipe(
					R.ops.map(option =>
						option.cata({
							Some: items => items.filter(item => item.getFSID() === fsid),
							None: () => [],
						}),
					),
				)
				.pipe(R.ops.chain(mQuery.metadataRepository.put)),

		setName: (fsid, name) =>
			R.if(isName(name), { onT: () => fsid, onF: () => einval(`.setName name: ${name}`) })
				.pipe(R.ops.chain(_getMetadataIfExistsR(mQuery)))
				.pipe(R.ops.chain(_rejectIfMetadataExistsByNameParentR(mQuery)))
				.pipe(R.ops.map(_toMetadataDTO))
				.pipe(R.ops.chain(_resetUpdatedByR(uQuery)))
				.pipe(R.ops.map(override({ name })))
				.pipe(R.ops.map(_resetUpdatedAt))
				.pipe(R.ops.map(Metadata.of))
				.pipe(R.ops.chain(MetadataCommand.of(mQuery, uQuery).replace)),

		setParent: (fsid, parent) =>
			(parent === null ? R.ok<any, any>(null) : _getMetadataIfExistsR(mQuery)(parent))
				.pipe(R.ops.map(() => fsid))
				.pipe(R.ops.chain(_getMetadataIfExistsR(mQuery)))
				.pipe(R.ops.chain(_rejectIfMetadataExistsByNameParentR(mQuery)))
				.pipe(
					R.ops.chain(item =>
						mQuery
							.getDescendents(fsid)
							.pipe(
								R.ops.chain(option =>
									option.cata({
										Some: descendents =>
											descendents.some(descendent => descendent.getFSID() === parent)
												? R.rrr(
														enxio(
															`.setParent circular reference: ${parent} is in children of ${fsid}`,
														),
													)
												: R.ok(item),
										None: () => R.ok(item),
									}),
								),
							),
					),
				)
				.pipe(R.ops.map(_toMetadataDTO))
				.pipe(R.ops.chain(_resetUpdatedByR(uQuery)))
				.pipe(R.ops.map(override({ parent })))
				.pipe(R.ops.map(_resetUpdatedAt))
				.pipe(R.ops.map(Metadata.of))
				.pipe(R.ops.chain(MetadataCommand.of(mQuery, uQuery).replace)),

		setSize: (fsid, size) =>
			R.if(isSize(size), { onT: () => fsid, onF: () => einval(`.setSize size: ${size}`) })
				.pipe(R.ops.chain(_getMetadataIfExistsR(mQuery)))
				.pipe(R.ops.map(_toMetadataDTO))
				.pipe(R.ops.chain(_resetUpdatedByR(uQuery)))
				.pipe(R.ops.map(override({ size })))
				.pipe(R.ops.map(_resetUpdatedAt))
				.pipe(R.ops.map(Metadata.of))
				.pipe(R.ops.chain(MetadataCommand.of(mQuery, uQuery).replace)),

		addLabels: (fsid, ...labels) =>
			_getMetadataIfExistsR(mQuery)(fsid)
				.pipe(R.ops.map(item => item.getLabels()))
				.pipe(R.ops.map(lbls => concat(lbls, labels).sort(alphaSort("ASC"))))
				.pipe(R.ops.chain(lbls => MetadataCommand.of(mQuery, uQuery).replaceLabels(fsid, lbls))),

		removeLabels: (fsid, ...labels) =>
			_getMetadataIfExistsR(mQuery)(fsid)
				.pipe(R.ops.map(item => item.getLabels()))
				.pipe(R.ops.map(lbls => lbls.filter(label => !labels.includes(label))))
				.pipe(R.ops.chain(lbls => MetadataCommand.of(mQuery, uQuery).replaceLabels(fsid, lbls))),

		replaceLabels: (fsid, labels) =>
			R.if(areLabels(labels), {
				onT: () => fsid,
				onF: () => einval(`.replaceLabels label: ${labels.find(l => !isNonEmptyString(l))}`),
			})
				.pipe(R.ops.chain(_getMetadataIfExistsR(mQuery)))
				.pipe(R.ops.map(_toMetadataDTO))
				.pipe(R.ops.chain(_resetUpdatedByR(uQuery)))
				.pipe(R.ops.map(override({ labels })))
				.pipe(R.ops.map(_resetUpdatedAt))
				.pipe(R.ops.map(Metadata.of))
				.pipe(R.ops.chain(MetadataCommand.of(mQuery, uQuery).replace)),

		addLinks: (fsid, ...links) =>
			_getMetadataIfExistsR(mQuery)(fsid)
				.pipe(R.ops.map(item => item.getLinks()))
				.pipe(R.ops.map(lnks => concat(lnks, links).sort(alphaSort())))
				.pipe(R.ops.chain(links => MetadataCommand.of(mQuery, uQuery).replaceLinks(fsid, links))),

		removeLinks: (fsid, ...links) =>
			_getMetadataIfExistsR(mQuery)(fsid)
				.pipe(R.ops.map(item => item.getLinks()))
				.pipe(R.ops.map(lnks => lnks.filter(link => !links.includes(link))))
				.pipe(R.ops.chain(links => MetadataCommand.of(mQuery, uQuery).replaceLinks(fsid, links))),

		replaceLinks: (fsid, links) =>
			R.if(areLinks(links), {
				onT: () => fsid,
				onF: () => einval(`.replaceLinks link: ${links.find(l => !isUUID(l))}`),
			})
				.pipe(R.ops.chain(_getMetadataIfExistsR(mQuery)))
				.pipe(R.ops.map(_toMetadataDTO))
				.pipe(R.ops.chain(_resetUpdatedByR(uQuery)))
				.pipe(R.ops.map(override({ links })))
				.pipe(R.ops.map(_resetUpdatedAt))
				.pipe(R.ops.map(Metadata.of))
				.pipe(R.ops.chain(MetadataCommand.of(mQuery, uQuery).replace)),

		appendChild: (fsid, child) => MetadataCommand.of(mQuery, uQuery).setParent(child, fsid),

		setProperty: (fsid, key, value) =>
			R.if(isNonEmptyString(key), {
				onT: () => fsid,
				onF: () => einval(`.setProperty key: ${key.toString()}`),
			})
				.pipe(R.ops.chain(_getMetadataIfExistsR(mQuery)))
				.pipe(R.ops.map(_toMetadataDTO))
				.pipe(R.ops.chain(_resetUpdatedByR(uQuery)))
				.pipe(R.ops.map(item => ({ ...item, props: { ...(item.props ?? {}), [key]: value } })))
				.pipe(R.ops.map(_resetUpdatedAt))
				.pipe(R.ops.map(Metadata.of))
				.pipe(R.ops.chain(MetadataCommand.of(mQuery, uQuery).replace)),

		removeProperty: (fsid, key) =>
			R.if(isNonEmptyString(key), {
				onT: () => fsid,
				onF: () => einval(`.removeProperty key: ${key.toString()}`),
			})
				.pipe(R.ops.chain(_getMetadataIfExistsR(mQuery)))
				.pipe(R.ops.map(_toMetadataDTO))
				.pipe(R.ops.chain(_resetUpdatedByR(uQuery)))
				.pipe(R.ops.map(item => ({ ...item, props: { ...(item.props ?? {}), [key]: undefined } })))
				.pipe(R.ops.map(_resetUpdatedAt))
				.pipe(R.ops.map(Metadata.of))
				.pipe(R.ops.chain(MetadataCommand.of(mQuery, uQuery).replace)),

		replace: value =>
			mQuery
				.get()
				.pipe(R.ops.chain(option => option.cata({ Some: xs => R.ok(xs), None: () => R.ok([]) })))
				.pipe(R.ops.chain(_replaceMetadataR(value)))
				.pipe(R.ops.chain(mQuery.metadataRepository.put)),
	}),
}

// --- Internal ---

const _getMetadataIfExistsR =
	(metadataQuery: TMetadataQuery) =>
	(fsid: FSID): TResult<TMetadata, TRrr<"ENOENT" | "EAGAIN" | "EINVAL">> =>
		metadataQuery
			.getByFSID(fsid)
			.pipe(
				R.ops.chain(item =>
					item.cata({ Some: R.ok, None: () => R.rrr(einval(`_getMetadataIfExistsR: ${fsid}`)) }),
				),
			)

const _resetUpdatedByR = (userQuery: TUserQuery) => (item: TMetadataDTO) =>
	userQuery.getCurrentUserID().pipe(R.ops.map(updatedBy => ({ ...item, updatedBy })))

type TRejectIfMetadataExistsByNameParentRFn = (
	metadataQuery: TMetadataQuery,
) => (metadata: TMetadata) => TResult<TMetadata, TRrr<"EEXIST">>
const _rejectIfMetadataExistsByNameParentR: TRejectIfMetadataExistsByNameParentRFn = q => m =>
	q
		.getByNameAndParent(m.getName(), m.getParent())
		.pipe(R.ops.swap())
		.pipe(
			R.ops.bimap(
				() => eexist(`_rejectIfMetadataExistsByNameParentR: ${m.getName()}, ${m.getParent()}`),
				() => m,
			),
		)

type TToMetadataDTOFn = <_TProps extends TMetadataProps = TMetadataProps>(
	metadata: TMetadata<_TProps>,
) => TMetadataDTO<_TProps>
const _toMetadataDTO: TToMetadataDTOFn = x => x.toDTO()

type TResetUpdatedAtFn = (metadata: TMetadataDTO) => TMetadataDTO
const _resetUpdatedAt: TResetUpdatedAtFn = override({ updatedAt: Date.now() })

type TReplaceMetadataRFn = (
	newValue: TMetadata,
) => (items: TMetadata[]) => TResult<TMetadata[], TRrr<"ENOENT">>
const _replaceMetadataR: TReplaceMetadataRFn = x => xs =>
	R.ok(xs.findIndex(item => item.getFSID() === x.getFSID()))
		.pipe(
			R.ops.chain(index =>
				R.if(index >= 0, {
					onT: () => ({ items: xs, index: index }),
					onF: () => enoent(`_replaceMetadataR: ${x} not in items`),
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
