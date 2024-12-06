/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { R } from "@ordo-pink/result"
import { type TMaokaJab } from "@ordo-pink/maoka"

import { from$, get_metadata_query } from "./maoka-ordo-jabs.impl"
import { Option } from "@ordo-pink/option"

export const get_descendents =
	(fsid?: Ordo.Metadata.FSID | null): TMaokaJab<() => Ordo.Metadata.Instance[]> =>
	({ use, refresh }) => {
		const metadata_query = use(get_metadata_query)

		return use(
			from$(metadata_query.$, [] as Ordo.Metadata.Instance[], (_, prev_value) => {
				if (!fsid) return []

				const new_descendents = metadata_query.get_descendents(fsid).cata(R.catas.or_else(() => []))
				if (new_descendents.length !== prev_value.length) void refresh()

				return new_descendents
			}),
		)
	}

export const get_ancestors =
	(fsid?: Ordo.Metadata.FSID | null): TMaokaJab<() => Ordo.Metadata.Instance[]> =>
	({ use, refresh }) => {
		const metadata_query = use(get_metadata_query)

		return use(
			from$(metadata_query.$, [] as Ordo.Metadata.Instance[], (_, prev_value) => {
				if (!fsid) return []

				const new_ancestors = metadata_query.get_ancestors(fsid).cata(R.catas.or_else(() => []))
				if (new_ancestors.length !== prev_value.length) void refresh()

				return new_ancestors
			}),
		)
	}

export const get_children =
	(fsid?: Ordo.Metadata.FSID | null): TMaokaJab<() => Ordo.Metadata.Instance[]> =>
	({ use }) => {
		const metadata_query = use(get_metadata_query)

		return use(
			from$(metadata_query.$, [] as Ordo.Metadata.Instance[], (_, prev_value) => {
				if (!fsid) return []

				const new_children = metadata_query.get_children(fsid).cata(R.catas.or_else(() => []))

				if (!prev_value) return new_children

				const equals = new_children.reduce(
					(acc, child, index) => (acc && prev_value[index] ? child.get_fsid() === prev_value[index]?.get_fsid() : false),
					true,
				)

				return equals ? prev_value : new_children
			}),
		)
	}

export const get_by_fsid =
	(fsid?: Ordo.Metadata.FSID | null): TMaokaJab<() => Ordo.Metadata.Instance | null> =>
	({ use }) => {
		const metadata_query = use(get_metadata_query)

		return use(
			from$<number, Ordo.Metadata.Instance | null>(metadata_query.$, null, (_, prev_value) => {
				if (!fsid) return null

				const metadata = metadata_query
					.get_by_fsid(fsid)
					.cata(R.catas.or_else(() => Option.None()))
					.cata({ None: () => null, Some: x => x })

				if (prev_value === metadata) return metadata
				if (prev_value && prev_value.equals(metadata!)) return metadata

				return metadata
			}),
		)
	}
