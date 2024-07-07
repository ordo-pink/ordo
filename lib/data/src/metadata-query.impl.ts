import { checkAll, isNonEmptyString, isUUID, negate } from "@ordo-pink/tau"
import { O } from "@ordo-pink/option"
import { R } from "@ordo-pink/result"

import { RRR, composeRrr, composeRrrThunk } from "./metadata.errors"
import { hasAllLabels, isHidden, isValidParent } from "./metadata-validations"
import { type FSID } from "./data.types"
import { type TMetadata } from "./metadata.types"
import { type TMetadataQueryStatic } from "./metadata-query.types"

const rrr = composeRrr("MetadataQuery")
const rrrThunk = composeRrrThunk("MetadataQuery")

// TODO: Repository contains stream
export const MetadataQuery: TMetadataQueryStatic = {
	of: repo => ({
		metadataRepository: repo,

		get: ({ showHidden } = { showHidden: false }) =>
			repo
				.get()
				.pipe(R.ops.map(items => (showHidden ? items : items.filter(negate(isHidden)))))
				.pipe(R.ops.map(items => (items.length > 0 ? O.some(items) : O.none()))),

		getByFSID: (fsid, options) =>
			R.if(isUUID(fsid), { onF: rrrThunk("EINVAL", `Invalid FSID: ${fsid}`) })
				.pipe(R.ops.chain(() => MetadataQuery.of(repo).get(options)))
				.pipe(
					// TODO: o.pipe(O.ops.chain)
					R.ops.chain(option =>
						option.cata({
							Some: metadata =>
								R.ok(O.fromNullable(metadata.find(item => item.getFSID() === fsid))),
							None: () => R.ok(O.none()),
						}),
					),
				),

		getByLabels: (labels, options) =>
			R.if(checkAll(isNonEmptyString, labels), {
				onF: () => rrr("EINVAL", `Invalid label: ${labels.find(l => !isNonEmptyString(l))}`),
			})
				.pipe(R.ops.chain(() => MetadataQuery.of(repo).get(options)))
				.pipe(
					R.ops.chain(option =>
						option.cata({
							Some: metadata => R.ok(O.fromNullable(metadata.filter(hasAllLabels(labels)))),
							None: () => R.ok(O.none()),
						}),
					),
				),

		getByNameAndParent: (name, parent, options) =>
			R.if(isNonEmptyString(name), { onF: rrrThunk("MV_EINVAL_NAME") })
				.pipe(R.ops.chain(() => R.if(isValidParent(parent), { onF: rrrThunk("MV_EINVAL_PARENT") })))
				.pipe(R.ops.chain(() => MetadataQuery.of(repo).get(options)))
				.pipe(R.ops.map(items => O.fromNullable(items.find(_hasGivenNameAndParent(name, parent))))),

		getChildren: (fsid, options) =>
			R.if(isUUID(fsid), { onF: rrrThunk("MV_EINVAL_FSID") })
				.pipe(
					R.ops.chain(() =>
						MetadataQuery.of(repo)
							.getByFSID(fsid, options)
							.pipe(
								R.ops.chain(option =>
									option.cata({
										Some: metadata => R.ok(metadata),
										None: () => R.rrr(RRR.MQ_ENOENT as const),
									}),
								),
							),
					),
				)
				.pipe(R.ops.chain(() => MetadataQuery.of(repo).get(options)))
				.pipe(R.ops.map(items => items.filter(item => item.getParent() === fsid))),

		getParent: (fsid, options) =>
			MetadataQuery.of(repo)
				.getByFSID(fsid, options)
				.pipe(
					R.ops.chain(o =>
						o.cata({
							Some: R.ok,
							None: () => R.rrr(rrr("ENOENT", `.getParent child ${fsid} not found`)),
						}),
					),
				)
				.pipe(R.ops.map(item => item.getParent()))
				.pipe(R.ops.chain(i => (i ? MetadataQuery.of(repo).getByFSID(i) : R.ok(O.none())))),

		hasChild: (fsid, child, options) =>
			R.if(isUUID(child), { onF: rrrThunk("MQ_INVALID_CHILD") })
				.pipe(R.ops.chain(() => MetadataQuery.of(repo).getChildren(fsid, options)))
				.pipe(R.ops.map(items => items.some(item => item.getFSID() === child))),

		getIncomingLinks: (fsid, options) =>
			R.if(isUUID(fsid), { onF: rrrThunk("MV_EINVAL_FSID") })
				.pipe(R.ops.chain(() => MetadataQuery.of(repo).get(options)))
				.pipe(R.ops.map(items => items.filter(item => item.getLinks().includes(fsid)))),

		hasIncomingLinks: (fsid, options) =>
			MetadataQuery.of(repo)
				.getIncomingLinks(fsid, options)
				.pipe(R.ops.map(items => items.length > 0)),

		hasChildren: (fsid, options) =>
			MetadataQuery.of(repo)
				.getChildren(fsid, options)
				.pipe(R.ops.map(items => items.length > 0)),

		// TODO:
		getAncestors: () => null as any,

		hasAncestor: (fsid, ancestor, options) =>
			R.if(isUUID(ancestor), { onF: rrrThunk("MV_EINVAL_ANCESTOR") })
				.pipe(R.ops.chain(() => MetadataQuery.of(repo).getAncestors(fsid, options)))
				.pipe(R.ops.map(items => items.some(item => item.getFSID() === ancestor))),

		// TODO:
		getDescendents: () => null as any,

		hasDescendent: (fsid, descendent, options) =>
			R.if(isUUID(descendent), { onF: rrrThunk("MQ_INVALID_DESCENDENT") })
				.pipe(R.ops.chain(() => MetadataQuery.of(repo).getDescendents(fsid, options)))
				.pipe(R.ops.map(items => items.some(item => item.getFSID() === descendent))),

		hasDescendents: (fsid, options) =>
			MetadataQuery.of(repo)
				.getDescendents(fsid, options)
				.pipe(R.ops.map(items => items.length > 0)),

		total: options =>
			MetadataQuery.of(repo)
				.get(options)
				.pipe(R.ops.map(items => items.length)),
	}),
}

// --- Internal ---

type THasGivenNameAndParentFn = (name: string, parent: FSID | null) => (item: TMetadata) => boolean
const _hasGivenNameAndParent: THasGivenNameAndParentFn = (name, parent) => item =>
	item.getName() === name && item.getParent() === parent
