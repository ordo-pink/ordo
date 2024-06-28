import { alphaSort, concat, isNonEmptyString, isObject, isUUID, override } from "@ordo-pink/tau"
import { swapE } from "@ordo-pink/either"

import { R, TResult, chainR, ifR, mapR, okR } from "@ordo-pink/result"
import { type TMetadata, type TMetadataDTO, type TMetadataProps } from "./metadata.types"
import {
	areValidLabels,
	areValidLinks,
	isName,
	isType,
	isValidParent,
	isValidSize,
} from "./metadata-validations"
import { type FSID } from "./data.types"
import { Metadata } from "./metadata.impl"
import { type TMetadataCommandStatic } from "./metadata-command.types"
import { type TMetadataQuery } from "./metadata-query.types"
import { type TUserQuery } from "./metadata-repository.types"
import { RRR, toRRR } from "./metadata.errors"

// TODO: Check permissions
// TODO: Audit
export const MetadataCommand: TMetadataCommandStatic = {
	of: (metadataQuery, userQuery) => ({
		create: ({ name, parent, type = "text/ordo", labels = [], links = [], props = {} }) =>
			R.if(isName(name), { onF: toRRR("INVALID_NAME") })
				.pipe(chainR(() => ifR(isValidParent(parent), { onF: toRRR("INVALID_PARENT") })))
				.pipe(chainR(() => ifR(areValidLabels(labels), { onF: toRRR("INVALID_LABEL") })))
				.pipe(chainR(() => ifR(areValidLinks(links), { onF: toRRR("INVALID_LINK") })))
				.pipe(chainR(() => ifR(isType(type), { onF: toRRR("INVALID_TYPE") })))
				.pipe(chainR(() => ifR(isObject(props), { onF: toRRR("INVALID_PROPS") })))
				.pipe(chainR(() => metadataQuery.getByNameAndParentE(name, parent)))
				.pipe(chainR(item => ifR(!item, { onF: toRRR("NAME_PARENT_TAKEN") })))
				.pipe(chainR(() => userQuery.getCurrentUserID()))
				.pipe(mapR(user => Metadata.from({ name, parent, user, type, labels, links, props })))
				.pipe(chainR(metadata => metadataQuery.get().pipe(mapR(items => items.concat(metadata)))))
				.pipe(mapR(MetadataCommand.of(metadataQuery, userQuery).write)),

		// TODO: Move add/remove to metadata$
		remove: fsid =>
			R.if(isUUID(fsid), { onT: () => fsid, onF: toRRR("INVALID_FSID") })
				.pipe(chainR(_getMetadataIfExistsR(metadataQuery)))
				.pipe(chainR(() => metadataQuery.get()))
				.pipe(mapR(items => items.filter(item => item.getFSID() === fsid)))
				.pipe(mapR(MetadataCommand.of(metadataQuery, userQuery).write)),

		setName: (fsid, name) =>
			R.if(isName(name), { onT: () => fsid, onF: toRRR("INVALID_NAME") })
				.pipe(chainR(_getMetadataIfExistsR(metadataQuery)))
				.pipe(chainR(_rejectIfMetadataExistsByNameParentR(metadataQuery)))
				.pipe(mapR(_toMetadataDTO))
				.pipe(chainR(_resetUpdatedByR(userQuery)))
				.pipe(mapR(override({ name })))
				.pipe(mapR(_resetUpdatedAt))
				.pipe(mapR(Metadata.of))
				.pipe(chainR(MetadataCommand.of(metadataQuery, userQuery).replace)),

		setParent: (fsid, parent) =>
			R.ok(_getMetadataIfExistsR(metadataQuery))
				.pipe(chainR(checkExistsE => (parent === null ? okR(null) : checkExistsE(parent))))
				.pipe(mapR(() => fsid))
				.pipe(chainR(_getMetadataIfExistsR(metadataQuery)))
				.pipe(chainR(_rejectIfMetadataExistsByNameParentR(metadataQuery)))
				.pipe(mapR(_toMetadataDTO))
				.pipe(chainR(_resetUpdatedByR(userQuery)))
				.pipe(mapR(override({ parent })))
				.pipe(mapR(_resetUpdatedAt))
				.pipe(mapR(Metadata.of))
				.pipe(chainR(MetadataCommand.of(metadataQuery, userQuery).replace)),

		setSize: (fsid, size) =>
			R.if(isValidSize(size), { onT: () => fsid, onF: toRRR("INVALID_SIZE") })
				.pipe(chainR(_getMetadataIfExistsR(metadataQuery)))
				.pipe(mapR(_toMetadataDTO))
				.pipe(chainR(_resetUpdatedByR(userQuery)))
				.pipe(mapR(override({ size })))
				.pipe(mapR(_resetUpdatedAt))
				.pipe(mapR(Metadata.of))
				.pipe(chainR(MetadataCommand.of(metadataQuery, userQuery).replace)),

		addLabels: (fsid, ...labels) =>
			R.if(areValidLabels(labels), { onT: () => fsid, onF: toRRR("INVALID_LABEL") })
				.pipe(chainR(_getMetadataIfExistsR(metadataQuery)))
				.pipe(mapR(_toMetadataDTO))
				.pipe(chainR(_resetUpdatedByR(userQuery)))
				.pipe(mapR(item => ({ ...item, labels: concat(item.labels, labels).sort(alphaSort()) })))
				.pipe(mapR(_resetUpdatedAt))
				.pipe(mapR(Metadata.of))
				.pipe(chainR(MetadataCommand.of(metadataQuery, userQuery).replace)),

		removeLabels: (fsid, ...labels) =>
			R.if(areValidLabels(labels), { onT: () => fsid, onF: toRRR("INVALID_LABEL") })
				.pipe(chainR(_getMetadataIfExistsR(metadataQuery)))
				.pipe(mapR(_toMetadataDTO))
				.pipe(chainR(_resetUpdatedByR(userQuery)))
				.pipe(mapR(item => ({ ...item, labels: item.labels.filter(lbl => !labels.includes(lbl)) })))
				.pipe(mapR(_resetUpdatedAt))
				.pipe(mapR(Metadata.of))
				.pipe(chainR(MetadataCommand.of(metadataQuery, userQuery).replace)),

		replaceLabels: (fsid, labels) =>
			R.if(areValidLabels(labels), { onT: () => fsid, onF: toRRR("INVALID_LABEL") })
				.pipe(chainR(_getMetadataIfExistsR(metadataQuery)))
				.pipe(mapR(_toMetadataDTO))
				.pipe(chainR(_resetUpdatedByR(userQuery)))
				.pipe(mapR(override({ labels })))
				.pipe(mapR(_resetUpdatedAt))
				.pipe(mapR(Metadata.of))
				.pipe(chainR(MetadataCommand.of(metadataQuery, userQuery).replace)),

		addLinks: (fsid, ...links) =>
			R.if(areValidLinks(links), { onT: () => fsid, onF: toRRR("INVALID_LINK") })
				.pipe(chainR(_getMetadataIfExistsR(metadataQuery)))
				.pipe(mapR(_toMetadataDTO))
				.pipe(chainR(_resetUpdatedByR(userQuery)))
				.pipe(mapR(item => ({ ...item, links: concat(item.links, links).sort(alphaSort()) })))
				.pipe(mapR(_resetUpdatedAt))
				.pipe(mapR(Metadata.of))
				.pipe(chainR(MetadataCommand.of(metadataQuery, userQuery).replace)),

		removeLinks: (fsid, ...links) =>
			R.if(areValidLinks(links), { onT: () => fsid, onF: toRRR("INVALID_LINK") })
				.pipe(chainR(_getMetadataIfExistsR(metadataQuery)))
				.pipe(mapR(_toMetadataDTO))
				.pipe(chainR(_resetUpdatedByR(userQuery)))
				.pipe(mapR(item => ({ ...item, links: item.links.filter(lbl => !links.includes(lbl)) })))
				.pipe(mapR(_resetUpdatedAt))
				.pipe(mapR(Metadata.of))
				.pipe(chainR(MetadataCommand.of(metadataQuery, userQuery).replace)),

		replaceLinks: (fsid, links) =>
			R.if(areValidLinks(links), { onT: () => fsid, onF: toRRR("INVALID_LINK") })
				.pipe(chainR(_getMetadataIfExistsR(metadataQuery)))
				.pipe(mapR(_toMetadataDTO))
				.pipe(chainR(_resetUpdatedByR(userQuery)))
				.pipe(mapR(override({ links })))
				.pipe(mapR(_resetUpdatedAt))
				.pipe(mapR(Metadata.of))
				.pipe(chainR(MetadataCommand.of(metadataQuery, userQuery).replace)),

		appendChild: (fsid, child) =>
			MetadataCommand.of(metadataQuery, userQuery).setParent(child, fsid),

		setProperty: (fsid, key, value) =>
			R.if(isNonEmptyString(key), { onT: () => fsid, onF: toRRR("INVALID_PROPS") })
				.pipe(chainR(_getMetadataIfExistsR(metadataQuery)))
				.pipe(mapR(_toMetadataDTO))
				.pipe(chainR(_resetUpdatedByR(userQuery)))
				.pipe(mapR(item => ({ ...item, props: { ...(item.props ?? {}), [key]: value } })))
				.pipe(mapR(_resetUpdatedAt))
				.pipe(mapR(Metadata.of))
				.pipe(chainR(MetadataCommand.of(metadataQuery, userQuery).replace)),

		removeProperty: (fsid, key) =>
			R.if(isNonEmptyString(key), { onT: () => fsid, onF: toRRR("INVALID_PROPS") })
				.pipe(chainR(_getMetadataIfExistsR(metadataQuery)))
				.pipe(mapR(_toMetadataDTO))
				.pipe(chainR(_resetUpdatedByR(userQuery)))
				.pipe(mapR(item => ({ ...item, props: { ...(item.props ?? {}), [key]: undefined } })))
				.pipe(mapR(_resetUpdatedAt))
				.pipe(mapR(Metadata.of))
				.pipe(chainR(MetadataCommand.of(metadataQuery, userQuery).replace)),

		write: value => metadataQuery.metadata$.next(value),

		replace: value =>
			metadataQuery
				.get()
				.pipe(
					chainR(items =>
						okR(items.findIndex(item => item.getFSID() === value.getFSID())).pipe(
							chainR(index =>
								ifR(index >= 0, {
									onT: () => ({ items, index }),
									onF: toRRR("METADATA_NOT_FOUND"),
								}),
							),
						),
					),
				)
				.pipe(
					mapR(({ items, index }) =>
						items
							.slice(0, index)
							.concat(value)
							.concat(items.slice(index + 1)),
					),
				)
				.pipe(mapR(MetadataCommand.of(metadataQuery, userQuery).write)),
	}),
}

// --- Internal ---

const _getMetadataIfExistsR =
	(query: TMetadataQuery) =>
	(
		fsid: FSID,
	): TResult<TMetadata, RRR.METADATA_NOT_FOUND | RRR.METADATA_NOT_LOADED | RRR.INVALID_FSID> =>
		query.getByFSIDE(fsid).pipe(
			chainR(item =>
				item.fold(
					() => R.rrr(toRRR("METADATA_NOT_FOUND")()),
					x => R.ok(x),
				),
			),
		)

const _resetUpdatedByR = (user: TUserQuery) => (item: TMetadataDTO) =>
	user.getCurrentUserID().pipe(mapR(updatedBy => ({ ...item, updatedBy })))

const _rejectIfMetadataExistsByNameParentR = (metadataQuery: TMetadataQuery) => (item: TMetadata) =>
	metadataQuery
		.getByNameAndParentE(item.getName(), item.getParent())
		.pipe(R.operators.swap())
		.pipe(R.operators.bimap(toRRR("NAME_PARENT_TAKEN"), () => item))

const _toMetadataDTO = <_TProps extends TMetadataProps = TMetadataProps>(
	item: TMetadata<_TProps>,
) => item.toDTO()

const _resetUpdatedAt = override({ updatedAt: Date.now() }) as (item: TMetadataDTO) => TMetadataDTO
