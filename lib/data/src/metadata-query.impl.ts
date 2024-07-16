import { gt, negate, prop } from "@ordo-pink/tau"
import { O } from "@ordo-pink/option"
import { R } from "@ordo-pink/result"

import { type FSID } from "./data.types"
import { M } from "./metadata.impl"
import { RRR } from "./metadata.errors"
import { type TMetadata } from "./metadata.types"
import { type TMetadataQueryStatic } from "./metadata-query.types"
import { get_wrong_label } from "./metadata.utils"

const LOCATION = "MetadataQuery"

const inval = RRR.codes.einval(LOCATION)
const noent = RRR.codes.enoent(LOCATION)

export const MetadataQuery: TMetadataQueryStatic = {
	of: repo => ({
		get version$() {
			return repo.sub
		},

		get: ({ show_hidden } = { show_hidden: false }) =>
			repo.get().pipe(R.ops.map(is => (show_hidden ? is : is.filter(negate(i => i.is_hidden()))))),

		get_by_fsid: (fsid, options) =>
			R.If(M.guards.is_fsid(fsid))
				.pipe(R.ops.err_map(() => inval(`by fsid -> fsid: ${fsid}`)))
				.pipe(R.ops.chain(() => MQ.of(repo).get(options)))
				.pipe(R.ops.map(m => O.FromNullable(m.find(i => i.get_fsid() === fsid)))),

		get_by_labels: (ls, options) =>
			R.If(M.guards.are_labels(ls))
				.pipe(R.ops.err_map(() => inval(`by labels -> label: ${get_wrong_label(ls)}`)))
				.pipe(R.ops.chain(() => MQ.of(repo).get(options)))
				.pipe(R.ops.map(is => is.filter(has_all_labels(ls)))),

		get_by_name_and_parent: (name, parent, options) =>
			R.Merge([
				R.If(M.guards.is_name(name), { F: () => inval(`by name & parent -> name: ${name}`) }),
				R.If(M.guards.is_parent(parent), { F: () => inval(`name & parent -> parent: ${parent}`) }),
			])
				.pipe(R.ops.chain(() => MQ.of(repo).get(options)))
				.pipe(R.ops.map(m => O.FromNullable(m.find(_has_name_and_parent(name, parent))))),

		get_children: (fsid, options) =>
			R.If(M.guards.is_fsid(fsid))
				.pipe(R.ops.err_map(() => inval(`children -> fsid: ${fsid}`)))
				.pipe(R.ops.chain(() => MQ.of(repo).get_by_fsid(fsid, options)))
				.pipe(R.ops.chain(o => R.FromOption(o, () => noent(`.getChildren -> fsid: ${fsid}`))))
				.pipe(R.ops.chain(() => MQ.of(repo).get(options)))
				.pipe(R.ops.map(is => is.filter(i => i.is_child_of(fsid)))),

		get_parent: (fsid, options) =>
			MQ.of(repo)
				.get_by_fsid(fsid, options)
				.pipe(R.ops.chain(o => R.FromOption(o, () => noent(`.getParent -> fsid: ${fsid}`))))
				.pipe(R.ops.map(i => i.get_parent()))
				.pipe(R.ops.chain(i => (i ? MQ.of(repo).get_by_fsid(i) : R.Ok(O.None())))),

		has_child: (fsid, child, options) =>
			R.If(M.guards.is_fsid(child))
				.pipe(R.ops.err_map(() => inval(`has -> child: ${child}`)))
				.pipe(R.ops.chain(() => MQ.of(repo).get_children(fsid, options)))
				.pipe(R.ops.map(is => is.some(i => i.is_child_of(fsid)))),

		get_incoming_links: (fsid, options) =>
			R.If(M.guards.is_fsid(fsid))
				.pipe(R.ops.err_map(() => inval(`incoming links -> fsid: ${fsid}`)))
				.pipe(R.ops.chain(() => MQ.of(repo).get(options)))
				.pipe(R.ops.map(is => is.filter(i => i.has_link_to(fsid)))),

		has_incoming_links: (fsid, options) =>
			MQ.of(repo)
				.get_incoming_links(fsid, options)
				.pipe(R.ops.map(prop("length")))
				.pipe(R.ops.map(gt(0))),

		has_children: (fsid, options) =>
			MQ.of(repo)
				.get_children(fsid, options)
				.pipe(R.ops.map(prop("length")))
				.pipe(R.ops.map(gt(0))),

		has_ancestor: (fsid, ancestor, options) =>
			R.If(M.guards.is_fsid(ancestor))
				.pipe(R.ops.err_map(() => inval(`has -> ancestor: ${ancestor}`)))
				.pipe(R.ops.chain(() => MQ.of(repo).get_ancestors(fsid, options)))
				.pipe(R.ops.map(is => is.some(i => i.get_fsid() === ancestor))),

		has_descendent: (fsid, descendent, options) =>
			R.If(M.guards.is_fsid(descendent))
				.pipe(R.ops.err_map(() => inval(`has -> descendent: ${descendent}`)))
				.pipe(R.ops.chain(() => MQ.of(repo).get_descendents(fsid, options)))
				.pipe(R.ops.map(is => is.some(i => i.get_fsid() === descendent))),

		has_descendents: (fsid, options) =>
			MQ.of(repo)
				.get_descendents(fsid, options)
				.pipe(R.ops.map(prop("length")))
				.pipe(R.ops.map(gt(0))),

		total: options =>
			MQ.of(repo)
				.get(options)
				.pipe(R.ops.map(prop("length"))),

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

type THasAllLabelsFn = (labels: string[]) => (item: TMetadata) => boolean
const has_all_labels: THasAllLabelsFn = ls => i => ls.every(l => i.get_labels().includes(l))
