import { type BehaviorSubject } from "rxjs"

import { chainE, fromNullableE, ifE, leftMapE, mapE, ofE } from "@ordo-pink/either"
import { checkAll, isNonEmptyString, isUUID, negate } from "@ordo-pink/tau"

import { hasAllLabels, isHidden, isValidParent } from "./metadata-validations"
import { type TMetadata } from "./metadata.types"
import { type TMetadataQuery } from "./metadata-query.types"
import { toRRR } from "./metadata.errors"

export const MetadataQuery = {
	of: (metadata$: BehaviorSubject<TMetadata[] | null>): TMetadataQuery => ({
		metadata$,

		get: ({ showHidden } = { showHidden: false }) =>
			fromNullableE(metadata$.getValue())
				.pipe(mapE(metadata => (showHidden ? metadata : metadata.filter(negate(isHidden)))))
				.pipe(leftMapE(toRRR("METADATA_NOT_LOADED"))),

		getByFSIDE: (fsid, options) =>
			ifE(isUUID(fsid), { onF: toRRR("INVALID_FSID") })
				.pipe(chainE(() => MetadataQuery.of(metadata$).get(options)))
				.pipe(mapE(m => m.find(i => i.getFSID() === fsid) ?? null)),

		getByLabelsE: (labels, options) =>
			ifE(checkAll(isNonEmptyString, labels), { onF: toRRR("INVALID_LABEL") })
				.pipe(chainE(() => MetadataQuery.of(metadata$).get(options)))
				.pipe(mapE(metadata => metadata.filter(hasAllLabels(labels)))),

		getByNameAndParentE: (name, parent, options) =>
			ifE(isNonEmptyString(name), { onF: toRRR("INVALID_NAME") })
				.pipe(chainE(() => ifE(isValidParent(parent), { onF: toRRR("INVALID_PARENT") })))
				.pipe(chainE(() => MetadataQuery.of(metadata$).get(options)))
				.pipe(mapE(m => m.find(i => i.getName() === name && i.getParent() === parent) ?? null)),

		getChildrenE: (fsid, options) =>
			ifE(isUUID(fsid), { onF: toRRR("INVALID_FSID") })
				.pipe(chainE(() => MetadataQuery.of(metadata$).get(options)))
				.pipe(mapE(metadata => metadata.filter(item => item.getParent() === fsid))),

		getParentE: (fsid, options) =>
			MetadataQuery.of(metadata$)
				.getByFSIDE(fsid, options)
				.pipe(mapE(item => item?.getParent()))
				.pipe(chainE(fsid => (fsid ? MetadataQuery.of(metadata$).getByFSIDE(fsid) : ofE(null)))),

		hasChildE: (fsid, child, options) =>
			ifE(isUUID(child), { onF: toRRR("INVALID_CHILD") })
				.pipe(chainE(() => MetadataQuery.of(metadata$).getChildrenE(fsid, options)))
				.pipe(mapE(children => children.some(item => item.getFSID() === child))),

		getIncomingLinksE: (fsid, options) =>
			ifE(isUUID(fsid), { onF: toRRR("INVALID_FSID") })
				.pipe(chainE(() => MetadataQuery.of(metadata$).get(options)))
				.pipe(mapE(metadata => metadata.filter(item => item.getLinks().includes(fsid)))),

		hasIncomingLinksE: (fsid, options) =>
			MetadataQuery.of(metadata$)
				.getIncomingLinksE(fsid, options)
				.pipe(mapE(items => items.length > 0)),

		hasChildrenE: (fsid, options) =>
			MetadataQuery.of(metadata$)
				.getChildrenE(fsid, options)
				.pipe(mapE(items => items.length > 0)),

		getAncestorsE: () => null as any,

		hasAncestorE: (fsid, ancestor, options) =>
			ifE(isUUID(ancestor), { onF: toRRR("INVALID_ANCESTOR") })
				.pipe(chainE(() => MetadataQuery.of(metadata$).getAncestorsE(fsid, options)))
				.pipe(mapE(ancestors => ancestors.some(item => item.getFSID() === ancestor))),

		getDescendentsE: () => null as any,

		hasDescendentE: (fsid, descendent, options) =>
			ifE(isUUID(descendent), { onF: toRRR("INVALID_DESCENDENT") })
				.pipe(chainE(() => MetadataQuery.of(metadata$).getDescendentsE(fsid, options)))
				.pipe(mapE(items => items.some(item => item.getFSID() === descendent))),

		hasDescendentsE: (fsid, options) =>
			MetadataQuery.of(metadata$)
				.getDescendentsE(fsid, options)
				.pipe(mapE(items => items.length > 0)),

		total: options =>
			MetadataQuery.of(metadata$)
				.get(options)
				.pipe(mapE(items => items.length)),
	}),
}
