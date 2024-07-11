import { isUUID, negate } from "@ordo-pink/tau"
import { O } from "@ordo-pink/option"
import { R } from "@ordo-pink/result"

import { are_lbls, has_all_lbls, is_hidden, is_name, is_parent } from "./metadata-validations"
import { type FSID } from "./data.types"
import { RRR } from "./metadata.errors"
import { type TMetadata } from "./metadata.types"
import { type TMetadataQueryStatic } from "./metadata-query.types"
import { get_wrong_label } from "./metadata.utils"

const LOCATION = "MetadataQuery"

const einval = RRR.codes.einval(LOCATION)
const enoent = RRR.codes.enoent(LOCATION)

export const MetadataQuery: TMetadataQueryStatic = {
	of: repo => ({
		get: ({ show_hidden } = { show_hidden: false }) =>
			repo.get().pipe(R.ops.map(items => (show_hidden ? items : items.filter(negate(is_hidden))))),

		get_by_fsid: (fsid, options) =>
			R.If(isUUID(fsid), { F: () => einval(`.getByFSID -> fsid: ${fsid}`) })
				.pipe(R.ops.chain(() => MQ.of(repo).get(options)))
				.pipe(R.ops.map(m => O.FromNullable(m.find(i => i.get_fsid() === fsid)))),

		get_by_labels: (ls, options) =>
			R.If(are_lbls(ls), { F: () => einval(`.getByLabels -> label: ${get_wrong_label(ls)}`) })
				.pipe(R.ops.chain(() => MQ.of(repo).get(options)))
				.pipe(R.ops.map(metadata => metadata.filter(has_all_lbls(ls)))),

		get_by_name_and_parent: (name, parent, options) =>
			R.Merge([
				R.If(is_name(name), { F: () => einval(`.getByNameAndParent -> name: ${name}`) }),
				R.If(is_parent(parent), { F: () => einval(`.getByNameAndParent -> parent: ${parent}`) }),
			])
				.pipe(R.ops.chain(() => MQ.of(repo).get(options)))
				.pipe(R.ops.map(m => O.FromNullable(m.find(_has_name_and_parent(name, parent))))),

		get_children: (fsid, options) =>
			R.If(isUUID(fsid), { F: () => einval(`.getChildren -> fsid: ${fsid}`) })
				.pipe(R.ops.chain(() => MQ.of(repo).get_by_fsid(fsid, options)))
				.pipe(R.ops.chain(o => R.FromOption(o, () => enoent(`.getChildren -> fsid: ${fsid}`))))
				.pipe(R.ops.chain(() => MQ.of(repo).get(options)))
				.pipe(R.ops.map(metadata => metadata.filter(item => item.get_parent() === fsid))),

		get_parent: (fsid, options) =>
			MQ.of(repo)
				.get_by_fsid(fsid, options)
				.pipe(R.ops.chain(o => R.FromOption(o, () => enoent(`.getParent -> fsid: ${fsid}`))))
				.pipe(R.ops.map(item => item.get_parent()))
				.pipe(R.ops.chain(i => (i ? MQ.of(repo).get_by_fsid(i) : R.Ok(O.None())))),

		has_child: (fsid, child, options) =>
			R.If(isUUID(child), { F: () => einval(`.hasChild -> child: ${child}`) })
				.pipe(R.ops.chain(() => MQ.of(repo).get_children(fsid, options)))
				.pipe(R.ops.map(metadata => metadata.some(item => item.get_fsid() === child))),

		get_incoming_links: (fsid, options) =>
			R.If(isUUID(fsid), { F: () => einval(`.getIncomingLinks -> fsid: ${fsid}`) })
				.pipe(R.ops.chain(() => MQ.of(repo).get(options)))
				.pipe(R.ops.map(metadata => metadata.filter(item => item.get_links().includes(fsid)))),

		has_incoming_links: (fsid, options) =>
			MQ.of(repo)
				.get_incoming_links(fsid, options)
				.pipe(R.ops.map(metadata => metadata.length > 0)),

		has_children: (fsid, options) =>
			MQ.of(repo)
				.get_children(fsid, options)
				.pipe(R.ops.map(metadata => metadata.length > 0)),

		has_ancestor: (fsid, ancestor, options) =>
			R.If(isUUID(ancestor), { F: () => einval(`.hasAncestor -> ancestor: ${ancestor}`) })
				.pipe(R.ops.chain(() => MQ.of(repo).get_ancestors(fsid, options)))
				.pipe(R.ops.map(metadata => metadata.some(item => item.get_fsid() === ancestor))),

		has_descendent: (fsid, descendent, options) =>
			R.If(isUUID(descendent), { F: () => einval(`.hasDescendent -> descendent: ${descendent}`) })
				.pipe(R.ops.chain(() => MQ.of(repo).get_descendents(fsid, options)))
				.pipe(R.ops.map(metadata => metadata.some(item => item.get_fsid() === descendent))),

		has_descendents: (fsid, options) =>
			MQ.of(repo)
				.get_descendents(fsid, options)
				.pipe(R.ops.map(metadata => metadata.length > 0)),

		total: options =>
			MQ.of(repo)
				.get(options)
				.pipe(R.ops.map(metadata => metadata.length)),

		get_ancestors: (fsid, options) =>
			MQ.of(repo)
				.get_parent(fsid, options)
				.pipe(
					R.ops.map(option => {
						const ancestors: TMetadata[] = []

						let parentOption = option

						while (parentOption !== O.None()) {
							const parent = parentOption.unwrap()!

							ancestors.push(parent)

							MQ.of(repo)
								.get_parent(parent.get_fsid())
								.pipe(
									R.ops.tap(option => {
										parentOption = option
									}),
								)
						}

						return ancestors
					}),
				),

		get_descendents: (fsid, options, accumulator = []) =>
			MQ.of(repo)
				.get_children(fsid, options)
				.pipe(
					R.ops.map(children => {
						for (const child of children) {
							MQ.of(repo).get_descendents(child.get_fsid(), options, accumulator)
						}

						return accumulator
					}),
				),
	}),
}

export const MQ = MetadataQuery

// --- Internal ---

type THasGivenNameAndParentFn = (name: string, parent: FSID | null) => (item: TMetadata) => boolean
const _has_name_and_parent: THasGivenNameAndParentFn = (name, parent) => item =>
	item.get_name() === name && item.get_parent() === parent
