import { R, type TResult } from "@ordo-pink/result"
import { alphaSort, concat, isNonEmptyString, isObject, isUUID, override } from "@ordo-pink/tau"

import { RRR, rrr, rrrThunk } from "./metadata.errors"
import { type TMetadata, type TMetadataDTO, type TMetadataProps } from "./metadata.types"
import { areLabels, areLinks, isName, isSize, isType, isValidParent } from "./metadata-validations"
import { type FSID } from "./data.types"
import { Metadata } from "./metadata.impl"
import { type TMetadataCommandStatic } from "./metadata-command.types"
import { type TMetadataQuery } from "./metadata-query.types"
import { type TUserQuery } from "./metadata-repository.types"

// TODO: Check permissions
// TODO: Audit
// TODO: Repository for accessing metadata$
export const MetadataCommand: TMetadataCommandStatic = {
	of: (mQuery, uQuery) => ({
		create: ({ name, parent, type = "text/ordo", labels = [], links = [], props = {} }) =>
			R.if(isName(name), { onF: rrrThunk("MV_EINVAL_NAME") })
				.pipe(R.ops.chain(() => R.if(isValidParent(parent), { onF: rrrThunk("MV_EINVAL_PARENT") })))
				.pipe(R.ops.chain(() => R.if(areLabels(labels), { onF: rrrThunk("MQ_INVALID_LABEL") })))
				.pipe(R.ops.chain(() => R.if(areLinks(links), { onF: rrrThunk("MQ_INVALID_LINK") })))
				.pipe(R.ops.chain(() => R.if(isType(type), { onF: rrrThunk("MQ_INVALID_TYPE") })))
				.pipe(R.ops.chain(() => R.if(isObject(props), { onF: rrrThunk("MQ_INVALID_PROPS") })))
				.pipe(R.ops.chain(() => mQuery.getByNameAndParent(name, parent)))
				.pipe(R.ops.chain(item => R.if(!item, { onF: rrrThunk("MC_NAME_CONFLICT") })))
				.pipe(R.ops.chain(() => uQuery.getCurrentUserID()))
				.pipe(R.ops.map(user => Metadata.from({ name, parent, user, type, labels, links, props })))
				.pipe(R.ops.chain(item => mQuery.get().pipe(R.ops.map(items => items.concat(item)))))
				.pipe(R.ops.chain(mQuery.metadataRepository.put)),

		// TODO: Move add/remove to metadata$
		remove: fsid =>
			R.if(isUUID(fsid), { onT: () => fsid, onF: rrrThunk("MV_EINVAL_FSID") })
				.pipe(R.ops.chain(_getMetadataIfExistsR(mQuery)))
				.pipe(R.ops.chain(() => mQuery.get()))
				.pipe(R.ops.map(items => items.filter(item => item.getFSID() === fsid)))
				.pipe(R.ops.chain(mQuery.metadataRepository.put)),

		setName: (fsid, name) =>
			R.if(isName(name), { onT: () => fsid, onF: rrrThunk("MV_EINVAL_NAME") })
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
				.pipe(R.ops.map(_toMetadataDTO))
				.pipe(R.ops.chain(_resetUpdatedByR(uQuery)))
				.pipe(R.ops.map(override({ parent })))
				.pipe(R.ops.map(_resetUpdatedAt))
				.pipe(R.ops.map(Metadata.of))
				.pipe(R.ops.chain(MetadataCommand.of(mQuery, uQuery).replace)),

		setSize: (fsid, size) =>
			R.if(isSize(size), { onT: () => fsid, onF: rrrThunk("MQ_INVALID_SIZE") })
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
			R.if(areLabels(labels), { onT: () => fsid, onF: rrrThunk("MQ_INVALID_LABEL") })
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
			R.if(areLinks(links), { onT: () => fsid, onF: rrrThunk("MQ_INVALID_LINK") })
				.pipe(R.ops.chain(_getMetadataIfExistsR(mQuery)))
				.pipe(R.ops.map(_toMetadataDTO))
				.pipe(R.ops.chain(_resetUpdatedByR(uQuery)))
				.pipe(R.ops.map(override({ links })))
				.pipe(R.ops.map(_resetUpdatedAt))
				.pipe(R.ops.map(Metadata.of))
				.pipe(R.ops.chain(MetadataCommand.of(mQuery, uQuery).replace)),

		appendChild: (fsid, child) => MetadataCommand.of(mQuery, uQuery).setParent(child, fsid),

		setProperty: (fsid, key, value) =>
			R.if(isNonEmptyString(key), { onT: () => fsid, onF: rrrThunk("MQ_INVALID_PROPS") })
				.pipe(R.ops.chain(_getMetadataIfExistsR(mQuery)))
				.pipe(R.ops.map(_toMetadataDTO))
				.pipe(R.ops.chain(_resetUpdatedByR(uQuery)))
				.pipe(R.ops.map(item => ({ ...item, props: { ...(item.props ?? {}), [key]: value } })))
				.pipe(R.ops.map(_resetUpdatedAt))
				.pipe(R.ops.map(Metadata.of))
				.pipe(R.ops.chain(MetadataCommand.of(mQuery, uQuery).replace)),

		removeProperty: (fsid, key) =>
			R.if(isNonEmptyString(key), { onT: () => fsid, onF: rrrThunk("MQ_INVALID_PROPS") })
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
				.pipe(R.ops.chain(_replaceMetadataR(value)))
				.pipe(R.ops.chain(mQuery.metadataRepository.put)),
	}),
}

// --- Internal ---

const _getMetadataIfExistsR =
	(metadataQuery: TMetadataQuery) =>
	(fsid: FSID): TResult<TMetadata, RRR.MQ_ENOENT | RRR.MR_EAGAIN | RRR.MV_EINVAL_FSID> =>
		metadataQuery
			.getByFSID(fsid)
			.pipe(R.ops.chain(item => item.cata({ Some: R.ok, None: () => R.rrr(rrr("MQ_ENOENT")) })))

const _resetUpdatedByR = (userQuery: TUserQuery) => (item: TMetadataDTO) =>
	userQuery.getCurrentUserID().pipe(R.ops.map(updatedBy => ({ ...item, updatedBy })))

type TRejectIfMetadataExistsByNameParentRFn = (
	metadataQuery: TMetadataQuery,
) => (metadata: TMetadata) => TResult<TMetadata, RRR.MC_NAME_CONFLICT>
const _rejectIfMetadataExistsByNameParentR: TRejectIfMetadataExistsByNameParentRFn = q => m =>
	q
		.getByNameAndParent(m.getName(), m.getParent())
		.pipe(R.ops.swap())
		.pipe(R.ops.bimap(rrrThunk("MC_NAME_CONFLICT"), () => m))

type TToMetadataDTOFn = <_TProps extends TMetadataProps = TMetadataProps>(
	metadata: TMetadata<_TProps>,
) => TMetadataDTO<_TProps>
const _toMetadataDTO: TToMetadataDTOFn = x => x.toDTO()

type TResetUpdatedAtFn = (metadata: TMetadataDTO) => TMetadataDTO
const _resetUpdatedAt: TResetUpdatedAtFn = override({ updatedAt: Date.now() })

type TReplaceMetadataRFn = (
	newValue: TMetadata,
) => (items: TMetadata[]) => TResult<TMetadata[], RRR.MQ_ENOENT>
const _replaceMetadataR: TReplaceMetadataRFn = x => xs =>
	R.ok(xs.findIndex(item => item.getFSID() === x.getFSID()))
		.pipe(
			R.ops.chain(index =>
				R.if(index >= 0, {
					onT: () => ({ items: xs, index: index }),
					onF: rrrThunk("MQ_ENOENT"),
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
