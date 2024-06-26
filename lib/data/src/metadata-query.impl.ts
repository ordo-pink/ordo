import { type BehaviorSubject } from "rxjs"

import { chainE, fromNullableE, ifE, leftMapE, mapE, ofE } from "@ordo-pink/either"
import { checkAll, isNonEmptyString, isUUID, negate } from "@ordo-pink/tau"

import { hasAllLabels, isHidden, isValidParent } from "./metadata-validations"
import { RRR } from "./metadata.errors"
import { type TMetadata } from "./metadata.types"
import { type TMetadataQuery } from "./metadata-query.types"

export const MetadataQuery = (metadata$: BehaviorSubject<TMetadata[] | null>): TMetadataQuery => ({
	metadata$,

	get: ({ showHidden } = { showHidden: false }) =>
		fromNullableE(metadata$.getValue())
			.pipe(mapE(metadata => (showHidden ? metadata : metadata.filter(negate(isHidden)))))
			.pipe(leftMapE(() => RRR.METADATA_NOT_LOADED)),

	getByFSIDE: (fsid, options) =>
		ifE(isUUID(fsid), { onF: () => RRR.INVALID_FSID as const })
			.pipe(chainE(() => MetadataQuery(metadata$).get(options)))
			.pipe(mapE(m => m.find(i => i.getFSID() === fsid) ?? null)),

	getByLabelsE: (labels, options) =>
		ifE(checkAll(isNonEmptyString, labels), { onF: () => RRR.INVALID_LABEL as const })
			.pipe(chainE(() => MetadataQuery(metadata$).get(options)))
			.pipe(mapE(metadata => metadata.filter(hasAllLabels(labels)))),

	getByNameAndParentE: (name, parent, options) =>
		ifE(isNonEmptyString(name), { onF: () => RRR.INVALID_NAME as const })
			.pipe(chainE(() => ifE(isValidParent(parent), { onF: () => RRR.INVALID_PARENT as const })))
			.pipe(chainE(() => MetadataQuery(metadata$).get(options)))
			.pipe(mapE(m => m.find(i => i.getName() === name && i.getParent() === parent) ?? null)),

	getChildrenE: (fsid, options) =>
		ifE(isUUID(fsid), { onF: () => RRR.INVALID_FSID as const })
			.pipe(chainE(() => MetadataQuery(metadata$).get(options)))
			.pipe(mapE(metadata => metadata.filter(item => item.getParent() === fsid))),

	getParentE: (fsid, options) =>
		MetadataQuery(metadata$)
			.getByFSIDE(fsid, options)
			.pipe(mapE(item => item?.getParent()))
			.pipe(chainE(fsid => (fsid ? MetadataQuery(metadata$).getByFSIDE(fsid) : ofE(null)))),

	hasChildE: (fsid, child, options) =>
		ifE(isUUID(child), { onF: () => RRR.INVALID_CHILD as const })
			.pipe(chainE(() => MetadataQuery(metadata$).getChildrenE(fsid, options)))
			.pipe(mapE(children => children.some(item => item.getFSID() === child))),

	getIncomingLinksE: (fsid, options) =>
		ifE(isUUID(fsid), { onF: () => RRR.INVALID_FSID as const })
			.pipe(chainE(() => MetadataQuery(metadata$).get(options)))
			.pipe(mapE(metadata => metadata.filter(item => item.getLinks().includes(fsid)))),

	hasIncomingLinksE: (fsid, options) =>
		MetadataQuery(metadata$)
			.getIncomingLinksE(fsid, options)
			.pipe(mapE(items => items.length > 0)),

	hasChildrenE: (fsid, options) =>
		MetadataQuery(metadata$)
			.getChildrenE(fsid, options)
			.pipe(mapE(items => items.length > 0)),

	getAncestorsE: () => null as any,

	hasAncestorE: (fsid, ancestor, options) =>
		ifE(isUUID(ancestor), { onF: () => RRR.INVALID_ANCESTOR as const })
			.pipe(chainE(() => MetadataQuery(metadata$).getAncestorsE(fsid, options)))
			.pipe(mapE(ancestors => ancestors.some(item => item.getFSID() === ancestor))),

	getDescendentsE: () => null as any,

	hasDescendentE: (fsid, descendent, options) =>
		ifE(isUUID(descendent), { onF: () => RRR.INVALID_DESCENDENT as const })
			.pipe(chainE(() => MetadataQuery(metadata$).getDescendentsE(fsid, options)))
			.pipe(mapE(items => items.some(item => item.getFSID() === descendent))),

	hasDescendentsE: (fsid, options) =>
		MetadataQuery(metadata$)
			.getDescendentsE(fsid, options)
			.pipe(mapE(items => items.length > 0)),

	total: options =>
		MetadataQuery(metadata$)
			.get(options)
			.pipe(mapE(items => items.length)),
})

// --- Internal ---
