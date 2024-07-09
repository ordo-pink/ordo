import { F, T, isUUID, negate } from "@ordo-pink/tau"
import { O } from "@ordo-pink/option"
import { R } from "@ordo-pink/result"

import {
	areLabels,
	hasAllLabels,
	isHidden,
	isLabel,
	isName,
	isParent,
} from "./metadata-validations"
import { type FSID } from "./data.types"
import { RRR } from "./metadata.errors"
import { type TMetadata } from "./metadata.types"
import { type TMetadataQueryStatic } from "./metadata-query.types"

const LOCATION = "MetadataQuery"

const einval = RRR.codes.einval(LOCATION)
const enoent = RRR.codes.enoent(LOCATION)

export const MetadataQuery: TMetadataQueryStatic = {
	of: repo => ({
		metadataRepository: repo,

		get: ({ showHidden } = { showHidden: false }) =>
			repo.get().pipe(R.ops.map(items => (showHidden ? items : items.filter(negate(isHidden))))),

		getByFSID: (fsid, options) =>
			R.if(isUUID(fsid), { onF: () => einval(`.getByFSID -> fsid: ${fsid}`) })
				.pipe(R.ops.chain(() => MQ.of(repo).get(options)))
				.pipe(R.ops.map(m => O.fromNullable(m.find(i => i.getFSID() === fsid)))),

		getByLabels: (labels, options) =>
			R.if(areLabels(labels), {
				onF: () => einval(`.getByLabels -> label: ${_first(negate(isLabel), labels)}`),
			})
				.pipe(R.ops.chain(() => MQ.of(repo).get(options)))
				.pipe(R.ops.map(metadata => metadata.filter(hasAllLabels(labels)))),

		getByNameAndParent: (name, parent, options) =>
			R.merge([
				R.if(isName(name), { onF: () => einval(`.getByNameAndParent -> name: ${name}`) }),
				R.if(isParent(parent), { onF: () => einval(`.getByNameAndParent -> parent: ${parent}`) }),
			])
				.pipe(R.ops.chain(() => MQ.of(repo).get(options)))
				.pipe(R.ops.map(m => O.fromNullable(m.find(_hasGivenNameAndParent(name, parent))))),

		getChildren: (fsid, options) =>
			R.if(isUUID(fsid), { onF: () => einval(`.getChildren -> fsid: ${fsid}`) })
				.pipe(R.ops.chain(() => MQ.of(repo).getByFSID(fsid, options)))
				.pipe(
					R.ops.chain(o =>
						o.cata({
							Some: m => R.Ok(m),
							None: () => R.Err(enoent(`.getChildren -> fsid: ${fsid}`)),
						}),
					),
				)
				.pipe(R.ops.chain(() => MQ.of(repo).get(options)))
				.pipe(R.ops.map(metadata => metadata.filter(item => item.getParent() === fsid))),

		getParent: (fsid, options) =>
			MQ.of(repo)
				.getByFSID(fsid, options)
				.pipe(
					R.ops.chain(o =>
						o.cata({
							Some: R.Ok,
							None: () => R.Err(enoent(`.getParent -> fsid: ${fsid}`)),
						}),
					),
				)
				.pipe(R.ops.map(item => item.getParent()))
				.pipe(R.ops.chain(i => (i ? MQ.of(repo).getByFSID(i) : R.Ok(O.none())))),

		hasChild: (fsid, child, options) =>
			R.if(isUUID(child), { onF: () => einval(`.hasChild -> child: ${child}`) })
				.pipe(R.ops.chain(() => MQ.of(repo).getChildren(fsid, options)))
				.pipe(
					R.ops.map(option =>
						option.cata({
							Some: metadata => metadata.some(item => item.getFSID() === child),
							None: () => false,
						}),
					),
				),

		getIncomingLinks: (fsid, options) =>
			R.if(isUUID(fsid), { onF: () => einval(`.getIncomingLinks -> fsid: ${fsid}`) })
				.pipe(R.ops.chain(() => MQ.of(repo).get(options)))
				.pipe(
					R.ops.chain(option =>
						option.cata({
							Some: metadata =>
								R.Ok(O.fromNullable(metadata.filter(item => item.getLinks().includes(fsid)))),
							None: () => R.Ok(O.none()),
						}),
					),
				),

		hasIncomingLinks: (fsid, options) =>
			MQ.of(repo)
				.getIncomingLinks(fsid, options)
				.pipe(R.ops.map(option => option.cata({ Some: T, None: F }))),

		hasChildren: (fsid, options) =>
			MQ.of(repo)
				.getChildren(fsid, options)
				.pipe(R.ops.map(option => option.cata({ Some: T, None: F }))),

		getAncestors: (fsid, options) =>
			MQ.of(repo)
				.getParent(fsid, options)
				.pipe(
					R.ops.chain(option => {
						const ancestors: TMetadata[] = []

						let parent = option

						while (parent !== O.none()) {
							ancestors.push(parent.unwrap()!)

							MQ.of(repo)
								.getParent(parent.unwrap()!.getFSID())
								.pipe(
									R.ops.tap(option => {
										parent = option
									}),
								)
						}

						return ancestors.length > 0 ? R.Ok(O.some(ancestors)) : R.Ok(O.none())
					}),
				),

		hasAncestor: (fsid, ancestor, options) =>
			R.if(isUUID(ancestor), { onF: () => einval(`.hasAncestor -> ancestor: ${ancestor}`) })
				.pipe(R.ops.chain(() => MQ.of(repo).getAncestors(fsid, options)))
				.pipe(
					R.ops.map(option =>
						option.cata({
							Some: metadata => metadata.some(item => item.getFSID() === ancestor),
							None: () => false,
						}),
					),
				),

		// TODO:
		getDescendents: (fsid, options, accumulator = []) =>
			MQ.of(repo)
				.getChildren(fsid, options)
				.pipe(
					R.ops.chain(option => {
						if (option !== O.none()) {
							const children = option.unwrap()!

							accumulator.push(...children)

							for (const child of children) {
								MQ.of(repo).getDescendents(child.getFSID(), options, accumulator)
							}
						}

						return accumulator.length > 0 ? R.Ok(O.some(accumulator)) : R.Ok(O.none())
					}),
				),
		hasDescendent: (fsid, descendent, options) =>
			R.if(isUUID(descendent), { onF: () => einval(`.hasDescendent -> descendent: ${descendent}`) })
				.pipe(R.ops.chain(() => MQ.of(repo).getDescendents(fsid, options)))
				.pipe(
					R.ops.map(option =>
						option.cata({
							Some: metadata => metadata.some(item => item.getFSID() === descendent),
							None: () => false,
						}),
					),
				),

		hasDescendents: (fsid, options) =>
			MQ.of(repo)
				.getDescendents(fsid, options)
				.pipe(R.ops.map(option => option.cata({ Some: T, None: F }))),

		total: options =>
			MQ.of(repo)
				.get(options)
				.pipe(R.ops.map(option => option.cata({ Some: x => x.length, None: () => 0 }))),
	}),
}

export const MQ = MetadataQuery

// --- Internal ---

type THasGivenNameAndParentFn = (name: string, parent: FSID | null) => (item: TMetadata) => boolean
const _hasGivenNameAndParent: THasGivenNameAndParentFn = (name, parent) => item =>
	item.getName() === name && item.getParent() === parent

const _first = <T>(f: (x: T) => boolean, items: T[]) => items.find(item => !f(item))
