import { alphaSort, concat, isNonEmptyString, isObject, isUUID, override } from "@ordo-pink/tau"
import { chainE, fromNullableE, ifE, mapE, ofE } from "@ordo-pink/either"

import { type TMetadata, type TMetadataProps } from "./metadata.types"
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
import { RRR } from "./metadata.errors"
import { type TMetadataCommandStatic } from "./metadata-command.types"
import { type TMetadataQuery } from "./metadata-query.types"

export const MetadataCommand: TMetadataCommandStatic = {
	of: (query, user) => ({
		create: ({
			name,
			parent,
			type = "text/ordo",
			fsid = crypto.randomUUID(),
			labels = [],
			links = [],
			props = {},
		}) =>
			ifE(isName(name), { onF: () => RRR.INVALID_NAME as const })
				.pipe(chainE(() => ifE(isValidParent(parent), { onF: () => RRR.INVALID_PARENT as const })))
				.pipe(chainE(() => ifE(isUUID(fsid), { onF: () => RRR.INVALID_FSID as const })))
				.pipe(chainE(() => ifE(areValidLabels(labels), { onF: () => RRR.INVALID_LABEL as const })))
				.pipe(chainE(() => ifE(areValidLinks(links), { onF: () => RRR.INVALID_LINK as const })))
				.pipe(chainE(() => ifE(isType(type), { onF: () => RRR.INVALID_TYPE as const })))
				.pipe(chainE(() => ifE(isObject(props), { onF: () => RRR.INVALID_PROPS as const })))
				.pipe(chainE(() => query.getByFSIDE(fsid)))
				.pipe(chainE(item => ifE(!item, { onF: () => RRR.FSID_ALREADY_TAKEN as const })))
				.pipe(chainE(() => query.getByNameAndParentE(name, parent)))
				.pipe(chainE(item => ifE(!item, { onF: () => RRR.NAME_PARENT_TAKEN as const })))
				.pipe(chainE(() => user.getCurrentUserID()))
				.pipe(mapE(user => Metadata.from({ fsid, name, parent, user, type, labels, links, props })))
				.pipe(chainE(metadata => query.get().pipe(mapE(items => items.concat(metadata)))))
				.pipe(mapE(MetadataCommand.of(query, user).write)),

		// TODO: Move add/remove to metadata$
		remove: fsid =>
			ifE(isUUID(fsid), { onT: () => fsid, onF: () => RRR.INVALID_FSID as const })
				.pipe(chainE(getMetadataIfExistsE(query)))
				.pipe(chainE(() => query.get()))
				.pipe(mapE(items => items.filter(item => item.getFSID() === fsid)))
				.pipe(mapE(MetadataCommand.of(query, user).write)),

		setName: (fsid, name) =>
			ifE(isName(name), { onT: () => fsid, onF: () => RRR.INVALID_NAME as const })
				.pipe(chainE(getMetadataIfExistsE(query)))
				.pipe(mapE(getMetadataDTO))
				.pipe(mapE(override({ name })))
				.pipe(mapE(Metadata.of))
				.pipe(chainE(MetadataCommand.of(query, user).replace)),

		setParent: (fsid, parent) =>
			ofE(getMetadataIfExistsE(query))
				.pipe(chainE(checkExistsE => (parent === null ? ofE(null) : checkExistsE(parent))))
				.pipe(chainE(() => query.getByFSIDE(fsid)))
				.pipe(chainE(item => fromNullableE(item, () => RRR.METADATA_NOT_FOUND as const)))
				.pipe(mapE(getMetadataDTO))
				.pipe(mapE(override({ parent })))
				.pipe(mapE(Metadata.of))
				.pipe(chainE(MetadataCommand.of(query, user).replace)),

		setSize: (fsid, size) =>
			ifE(isValidSize(size), { onT: () => fsid, onF: () => RRR.INVALID_SIZE as const })
				.pipe(chainE(getMetadataIfExistsE(query)))
				.pipe(mapE(getMetadataDTO))
				.pipe(mapE(override({ size })))
				.pipe(mapE(Metadata.of))
				.pipe(chainE(MetadataCommand.of(query, user).replace)),

		addLabels: (fsid, ...labels) =>
			ifE(areValidLabels(labels), { onT: () => fsid, onF: () => RRR.INVALID_LABEL as const })
				.pipe(chainE(getMetadataIfExistsE(query)))
				.pipe(mapE(getMetadataDTO))
				.pipe(mapE(item => ({ ...item, labels: concat(item.labels, labels).sort(alphaSort()) })))
				.pipe(mapE(Metadata.of))
				.pipe(chainE(MetadataCommand.of(query, user).replace)),

		removeLabels: (fsid, ...labels) =>
			ifE(areValidLabels(labels), { onT: () => fsid, onF: () => RRR.INVALID_LABEL as const })
				.pipe(chainE(getMetadataIfExistsE(query)))
				.pipe(mapE(getMetadataDTO))
				.pipe(mapE(item => ({ ...item, labels: item.labels.filter(lbl => !labels.includes(lbl)) })))
				.pipe(mapE(Metadata.of))
				.pipe(chainE(MetadataCommand.of(query, user).replace)),

		replaceLabels: (fsid, labels) =>
			ifE(areValidLabels(labels), { onT: () => fsid, onF: () => RRR.INVALID_LABEL as const })
				.pipe(chainE(getMetadataIfExistsE(query)))
				.pipe(mapE(getMetadataDTO))
				.pipe(mapE(override({ labels })))
				.pipe(mapE(Metadata.of))
				.pipe(chainE(MetadataCommand.of(query, user).replace)),

		addLinks: (fsid, ...links) =>
			ifE(areValidLinks(links), { onT: () => fsid, onF: () => RRR.INVALID_LINK as const })
				.pipe(chainE(getMetadataIfExistsE(query)))
				.pipe(mapE(getMetadataDTO))
				.pipe(mapE(item => ({ ...item, links: concat(item.links, links).sort(alphaSort()) })))
				.pipe(mapE(Metadata.of))
				.pipe(chainE(MetadataCommand.of(query, user).replace)),

		removeLinks: (fsid, ...links) =>
			ifE(areValidLinks(links), { onT: () => fsid, onF: () => RRR.INVALID_LINK as const })
				.pipe(chainE(getMetadataIfExistsE(query)))
				.pipe(mapE(getMetadataDTO))
				.pipe(mapE(item => ({ ...item, links: item.links.filter(lbl => !links.includes(lbl)) })))
				.pipe(mapE(Metadata.of))
				.pipe(chainE(MetadataCommand.of(query, user).replace)),

		replaceLinks: (fsid, links) =>
			ifE(areValidLinks(links), { onT: () => fsid, onF: () => RRR.INVALID_LINK as const })
				.pipe(chainE(getMetadataIfExistsE(query)))
				.pipe(mapE(getMetadataDTO))
				.pipe(mapE(override({ links })))
				.pipe(mapE(Metadata.of))
				.pipe(chainE(MetadataCommand.of(query, user).replace)),

		appendChild: (fsid, child) => MetadataCommand.of(query, user).setParent(child, fsid),

		setProperty: (fsid, key, value) =>
			ifE(isNonEmptyString(key), { onT: () => fsid, onF: () => RRR.INVALID_PROPS as const })
				.pipe(chainE(getMetadataIfExistsE(query)))
				.pipe(mapE(getMetadataDTO))
				.pipe(mapE(item => ({ ...item, props: override({ [key]: value })(item.props ?? {}) })))
				.pipe(mapE(Metadata.of))
				.pipe(chainE(MetadataCommand.of(query, user).replace)),

		removeProperty: (fsid, key) =>
			ifE(isNonEmptyString(key), { onT: () => fsid, onF: () => RRR.INVALID_PROPS as const })
				.pipe(chainE(getMetadataIfExistsE(query)))
				.pipe(mapE(getMetadataDTO))
				.pipe(mapE(item => ({ ...item, props: override({ [key]: undefined })(item.props ?? {}) })))
				.pipe(mapE(Metadata.of))
				.pipe(chainE(MetadataCommand.of(query, user).replace)),

		write: value => query.metadata$.next(value),

		replace: value =>
			query
				.get()
				.pipe(
					chainE(items =>
						ofE(items.findIndex(item => item.getFSID() === value.getFSID())).pipe(
							chainE(index =>
								ifE(index >= 0, {
									onT: () => ({ items, index }),
									onF: () => RRR.METADATA_NOT_FOUND as const,
								}),
							),
						),
					),
				)
				.pipe(
					mapE(({ items, index }) =>
						items
							.slice(0, index)
							.concat(value)
							.concat(items.slice(index + 1)),
					),
				)
				.pipe(mapE(MetadataCommand.of(query, user).write)),
	}),
}

// --- Internal ---

const getMetadataIfExistsE = (query: TMetadataQuery) => (fsid: FSID) =>
	query
		.getByFSIDE(fsid)
		.pipe(chainE(item => fromNullableE(item, () => RRR.METADATA_NOT_FOUND as const)))

const getMetadataDTO = <_TProps extends TMetadataProps = TMetadataProps>(
	item: TMetadata<_TProps>,
) => item.toDTO()
