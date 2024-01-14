// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { FSID, PlainData } from "@ordo-pink/data"
import { Switch } from "@ordo-pink/switch"
import { useData } from "./use-data.hook"

type UseChildren = (item: PlainData | FSID | "root" | null) => PlainData[]

/**
 * Returns children as an array of PlainData objects for provided data. The data can be provided as
 * a `FSID`, or a `PlainData` object. Providing `"root"` will return top level PlainData objects.
 * Providing `null` will return an empty array.
 *
 * @type {UseChildren}
 */
export const useChildren: UseChildren = item => {
	const data = useData()

	const fsid = Switch.empty()
		.case(Boolean(item && (item as PlainData).fsid), () => (item as PlainData).fsid)
		.case(typeof item === "string" && item !== "root", () => item as FSID)
		.default(() => null)

	return Switch.empty()
		.case(!data || !item, () => [])
		.default(() => data!.filter(item => item.parent === fsid))
}
