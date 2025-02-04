/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { gt, negate, prop } from "@ordo-pink/tau"
import { R } from "@ordo-pink/result"

import { Metadata as M } from "../../../../core/src/metadata.impl"
import { RRR } from "../../../../core/src/rrr"
import { get_wrong_label } from "../../../../core/src/metadata-utils.impl"

// TODO Move to frontend-app
// TODO Avoid reusing methods in all queries
export const MetadataQuery: Ordo.Metadata.QueryStatic = {
	Of: (repo, check_query_permission) => ({
		get $() {
			return repo.$
		},

		get: ({ show_hidden } = { show_hidden: false }) =>
			check_query_permission("metadata.get")
				.pipe(R.ops.chain(() => repo.get()))
				.pipe(R.ops.map(is => (show_hidden ? is : is.filter(negate(i => i.is_hidden()))))),

		get_by_fsid: (fsid, options) =>
			R.Merge([
				check_query_permission("metadata.get_by_fsid"),
				R.If(M.Validations.is_fsid(fsid), { F: () => RRR.codes.einval(`MetadataQuery.get_by_fsid: Invalid FSID: ${fsid}`) }),
			])
				.pipe(R.ops.chain(() => MetadataQuery.Of(repo, check_query_permission).get(options)))
				.pipe(R.ops.map(m => m.find(i => i.get_fsid() === fsid) ?? null)),

		get_by_labels: (ls, options) =>
			R.Merge([
				check_query_permission("metadata.get_by_labels"),
				R.If(M.Validations.are_labels(ls), {
					F: () => RRR.codes.einval("MetadataQuery.get_by_labels: Invalid label:", get_wrong_label(ls)),
				}),
			])
				.pipe(R.ops.chain(() => MetadataQuery.Of(repo, check_query_permission).get(options)))
				.pipe(R.ops.map(is => is.filter(has_all_labels(ls)))),

		get_by_name: (name, parent, options) =>
			R.Merge([
				check_query_permission("metadata.get_by_name"),
				R.If(M.Validations.is_name(name), { F: () => RRR.codes.einval("MetadataQuery.get_by_name: Invalid name:", name) }),
				R.If(M.Validations.is_parent(parent), {
					F: () => RRR.codes.einval("MetadataQuery.get_by_name: Invalid parent:", parent),
				}),
			])
				.pipe(R.ops.chain(() => MetadataQuery.Of(repo, check_query_permission).get(options)))
				.pipe(R.ops.map(m => m.find(_has_name_and_parent(name, parent)) ?? null)),

		get_children: (fsid, options) =>
			fsid
				? R.Merge([
						check_query_permission("metadata.get_children"),
						R.If(M.Validations.is_fsid(fsid), {
							F: () => RRR.codes.einval(`MetadataQuery.get_children: Invalid FSID: ${fsid}`),
						}),
					])
						.pipe(R.ops.chain(() => MetadataQuery.Of(repo, check_query_permission).get_by_fsid(fsid, options)))
						.pipe(R.ops.chain(o => R.FromNullable(o, () => RRR.codes.enoent(`.getChildren -> fsid: ${fsid}`))))
						.pipe(R.ops.chain(() => MetadataQuery.Of(repo, check_query_permission).get(options)))
						.pipe(R.ops.map(is => is.filter(i => i.is_child_of(fsid))))
				: check_query_permission("metadata.get_children")
						.pipe(R.ops.chain(() => MetadataQuery.Of(repo, check_query_permission).get(options)))
						.pipe(R.ops.map(is => is.filter(i => i.is_root_child()))),

		get_parent: (fsid, options) =>
			check_query_permission("metadata.get_parent")
				.pipe(R.ops.chain(() => MetadataQuery.Of(repo, check_query_permission).get_by_fsid(fsid, options)))
				.pipe(R.ops.chain(o => R.FromNullable(o, () => RRR.codes.enoent(`.getParent -> fsid: ${fsid}`))))
				.pipe(R.ops.map(i => i.get_parent()))
				.pipe(R.ops.chain(i => (i ? MetadataQuery.Of(repo, check_query_permission).get_by_fsid(i) : R.Ok(null)))),

		has_child: (fsid, child, options) =>
			R.Merge([
				check_query_permission("metadata.has_child"),
				R.If(M.Validations.is_fsid(child), { F: () => RRR.codes.einval(`MetadataQuery.has_child: Invalid child: ${child}`) }),
			])
				.pipe(R.ops.chain(() => MetadataQuery.Of(repo, check_query_permission).get_children(fsid, options)))
				.pipe(R.ops.map(is => is.some(i => i.get_fsid() === child))),

		get_incoming_links: (fsid, options) =>
			R.Merge([
				check_query_permission("metadata.get_incoming_links"),
				R.If(M.Validations.is_fsid(fsid), {
					F: () => RRR.codes.einval(`MetadataQuery.get_incoming_links: Invalid FSID: ${fsid}`),
				}),
			])
				.pipe(R.ops.chain(() => MetadataQuery.Of(repo, check_query_permission).get(options)))
				.pipe(R.ops.map(is => is.filter(i => i.has_link_to(fsid)))),

		get_outgoing_links: (fsid, options) =>
			R.Merge([
				check_query_permission("metadata.get_outgoing_links"),
				R.If(M.Validations.is_fsid(fsid), {
					F: () => RRR.codes.einval(`MetadataQuery.get_incoming_links: Invalid FSID: ${fsid}`),
				}),
			])
				.pipe(R.ops.chain(() => MetadataQuery.Of(repo, check_query_permission).get_by_fsid(fsid, options)))
				.pipe(R.ops.chain(i => R.FromNullable(i, () => RRR.codes.enoent(`.get_outgoing_links -> fsid: ${fsid}`))))
				.pipe(R.ops.map(i => i.get_links()))
				.pipe(R.ops.chain(is => R.Merge(is.map(i => MetadataQuery.Of(repo, check_query_permission).get_by_fsid(i)))))
				.pipe(R.ops.map(is => is.filter(Boolean) as Ordo.Metadata.Instance[])),

		has_incoming_links: (fsid, options) =>
			check_query_permission("metadata.has_incoming_links")
				.pipe(R.ops.chain(() => MetadataQuery.Of(repo, check_query_permission).get_incoming_links(fsid, options)))
				.pipe(R.ops.map(prop("length")))
				.pipe(R.ops.map(gt(0))),

		has_children: (fsid, options) =>
			check_query_permission("metadata.has_children")
				.pipe(R.ops.chain(() => MetadataQuery.Of(repo, check_query_permission).get_children(fsid, options)))
				.pipe(R.ops.map(prop("length")))
				.pipe(R.ops.map(gt(0))),

		has_ancestor: (fsid, ancestor, options) =>
			R.Merge([
				check_query_permission("metadata.has_ancestor"),
				R.If(M.Validations.is_fsid(ancestor), {
					F: () => RRR.codes.einval(`MetadataQuery.has_ancestor: Invalid ancestor: ${ancestor}`),
				}),
			])
				.pipe(R.ops.chain(() => MetadataQuery.Of(repo, check_query_permission).get_ancestors(fsid, options)))
				.pipe(R.ops.map(is => is.some(i => i.get_fsid() === ancestor))),

		has_descendent: (fsid, desc, options) =>
			R.Merge([
				check_query_permission("metadata.has_descendent"),
				R.If(M.Validations.is_fsid(desc), {
					F: () => RRR.codes.einval(`MetadataQuery.has_descendent: Invalid descendent: ${desc}`),
				}),
			])
				.pipe(R.ops.chain(() => MetadataQuery.Of(repo, check_query_permission).get_descendents(fsid, options)))
				.pipe(R.ops.map(is => is.some(i => i.get_fsid() === desc))),

		has_descendents: (fsid, options) =>
			check_query_permission("metadata.has_descendents")
				.pipe(R.ops.chain(() => MetadataQuery.Of(repo, check_query_permission).get_descendents(fsid, options)))
				.pipe(R.ops.map(prop("length")))
				.pipe(R.ops.map(gt(0))),

		total: options =>
			check_query_permission("metadata.total")
				.pipe(R.ops.chain(() => MetadataQuery.Of(repo, check_query_permission).get(options)))
				.pipe(R.ops.map(prop("length"))),

		get_ancestors: (fsid, options) =>
			check_query_permission("metadata.get_ancestors")
				.pipe(R.ops.chain(() => MetadataQuery.Of(repo, check_query_permission).get_parent(fsid, options)))
				.pipe(
					R.ops.map(option => {
						const ancestors: Ordo.Metadata.Instance[] = []

						let parent = option

						while (parent) {
							ancestors.push(parent)

							MetadataQuery.Of(repo, check_query_permission)
								.get_parent(parent.get_fsid())
								.pipe(
									R.ops.tap(option => {
										parent = option
									}),
								)
						}

						return ancestors.toReversed()
					}),
				),

		get_descendents: (fsid, options, accumulator = []) =>
			check_query_permission("metadata.get_descendents")
				.pipe(R.ops.chain(() => MetadataQuery.Of(repo, check_query_permission).get_children(fsid, options)))
				.pipe(
					R.ops.map(children => {
						for (const child of children) {
							accumulator.push(child)
							MetadataQuery.Of(repo, check_query_permission).get_descendents(child.get_fsid(), options, accumulator)
						}

						return accumulator
					}),
				),
	}),
}

export const MQ = MetadataQuery

// --- Internal ---

type THasGivenNameAndParentFn = (name: string, parent: Ordo.Metadata.FSID | null) => (item: Ordo.Metadata.Instance) => boolean
const _has_name_and_parent: THasGivenNameAndParentFn = (name, parent) => item =>
	item.get_name() === name && item.get_parent() === parent

type THasAllLabelsFn = (labels: Ordo.Metadata.Label[]) => (item: Ordo.Metadata.Instance) => boolean
const has_all_labels: THasAllLabelsFn = ls => i => ls.every(l => i.get_labels().includes(l))
