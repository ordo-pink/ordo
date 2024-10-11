import { R } from "@ordo-pink/result"
import { type TMaokaJab } from "@ordo-pink/maoka"

import { from$, get_metadata_query } from "./maoka-ordo-jabs.impl"

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
