import { F, T, checkAll, isNonEmptyString, isUUID, negate } from "@ordo-pink/tau"
import { O } from "@ordo-pink/option"
import { R } from "@ordo-pink/result"

import { RRR } from "./metadata.errors"
import { hasAllLabels, isHidden, isParent } from "./metadata-validations"
import { type FSID } from "./data.types"
import { type TMetadata } from "./metadata.types"
import { type TMetadataQueryStatic } from "./metadata-query.types"

const LOCATION = "MetadataQuery"

const einval = RRR.codes.einval(LOCATION)
const enoent = RRR.codes.enoent(LOCATION)

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
			R.if(isUUID(fsid), { onF: () => einval(`getByFSID fsid: ${fsid}`) })
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
				onF: () => einval(`getByLabels label: ${labels.find(l => !isNonEmptyString(l))}`),
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
			R.if(isNonEmptyString(name), { onF: () => einval(`getByNameAndParent name: ${name}`) })
				.pipe(
					R.ops.chain(() =>
						R.if(isParent(parent), {
							onF: () => einval(`getByNameAndParent parent: ${parent}`),
						}),
					),
				)
				.pipe(R.ops.chain(() => MetadataQuery.of(repo).get(options)))
				.pipe(
					R.ops.chain(option =>
						option.cata({
							Some: metadata =>
								R.ok(O.fromNullable(metadata.find(_hasGivenNameAndParent(name, parent)))),
							None: () => R.ok(O.none()),
						}),
					),
				),

		getChildren: (fsid, options) =>
			R.if(isUUID(fsid), { onF: () => einval(`getChildren fsid: ${fsid}`) })
				.pipe(
					R.ops.chain(() =>
						MetadataQuery.of(repo)
							.getByFSID(fsid, options)
							.pipe(
								R.ops.chain(option =>
									option.cata({
										Some: metadata => R.ok(metadata),
										None: () => R.rrr(enoent(`getChildren fsid: ${fsid}`)),
									}),
								),
							),
					),
				)
				.pipe(R.ops.chain(() => MetadataQuery.of(repo).get(options)))
				.pipe(
					R.ops.chain(option =>
						option.cata({
							Some: metadata =>
								R.ok(O.fromNullable(metadata.filter(item => item.getParent() === fsid))),
							None: () => R.ok(O.none()),
						}),
					),
				),

		getParent: (fsid, options) =>
			MetadataQuery.of(repo)
				.getByFSID(fsid, options)
				.pipe(
					R.ops.chain(o =>
						o.cata({
							Some: R.ok,
							None: () => R.rrr(enoent(`.getParent fsid: ${fsid}`)),
						}),
					),
				)
				.pipe(R.ops.map(item => item.getParent()))
				.pipe(R.ops.chain(i => (i ? MetadataQuery.of(repo).getByFSID(i) : R.ok(O.none())))),

		hasChild: (fsid, child, options) =>
			R.if(isUUID(child), { onF: () => einval(`.hasChild child: ${child}`) })
				.pipe(R.ops.chain(() => MetadataQuery.of(repo).getChildren(fsid, options)))
				.pipe(
					R.ops.map(option =>
						option.cata({
							Some: metadata => metadata.some(item => item.getFSID() === child),
							None: () => false,
						}),
					),
				),

		getIncomingLinks: (fsid, options) =>
			R.if(isUUID(fsid), { onF: () => einval(`.getIncomingLinks fsid: ${fsid}`) })
				.pipe(R.ops.chain(() => MetadataQuery.of(repo).get(options)))
				.pipe(
					R.ops.chain(option =>
						option.cata({
							Some: metadata =>
								R.ok(O.fromNullable(metadata.filter(item => item.getLinks().includes(fsid)))),
							None: () => R.ok(O.none()),
						}),
					),
				),

		hasIncomingLinks: (fsid, options) =>
			MetadataQuery.of(repo)
				.getIncomingLinks(fsid, options)
				.pipe(R.ops.map(option => option.cata({ Some: T, None: F }))),

		hasChildren: (fsid, options) =>
			MetadataQuery.of(repo)
				.getChildren(fsid, options)
				.pipe(R.ops.map(option => option.cata({ Some: T, None: F }))),

		// TODO:
		getAncestors: () => null as any,

		hasAncestor: (fsid, ancestor, options) =>
			R.if(isUUID(ancestor), { onF: () => einval(`.hasAncestor ancestor: ${ancestor}`) })
				.pipe(R.ops.chain(() => MetadataQuery.of(repo).getAncestors(fsid, options)))
				.pipe(
					R.ops.map(option =>
						option.cata({
							Some: metadata => metadata.some(item => item.getFSID() === ancestor),
							None: () => false,
						}),
					),
				),

		// TODO:
		getDescendents: () => null as any,

		hasDescendent: (fsid, descendent, options) =>
			R.if(isUUID(descendent), { onF: () => einval(`.hasDescendent descendent: ${descendent}`) })
				.pipe(R.ops.chain(() => MetadataQuery.of(repo).getDescendents(fsid, options)))
				.pipe(
					R.ops.map(option =>
						option.cata({
							Some: metadata => metadata.some(item => item.getFSID() === descendent),
							None: () => false,
						}),
					),
				),

		hasDescendents: (fsid, options) =>
			MetadataQuery.of(repo)
				.getDescendents(fsid, options)
				.pipe(R.ops.map(option => option.cata({ Some: T, None: F }))),

		total: options =>
			MetadataQuery.of(repo)
				.get(options)
				.pipe(R.ops.map(option => option.cata({ Some: x => x.length, None: () => 0 }))),
	}),
}

// --- Internal ---

type THasGivenNameAndParentFn = (name: string, parent: FSID | null) => (item: TMetadata) => boolean
const _hasGivenNameAndParent: THasGivenNameAndParentFn = (name, parent) => item =>
	item.getName() === name && item.getParent() === parent
