// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { FSID, PlainData } from "@ordo-pink/data"
import { useSharedContext } from "@ordo-pink/frontend-core"
import { useDataByFSID } from "./use-data-selector"

export const useChildren = (item: PlainData | FSID | null) => {
	const { data } = useSharedContext()
	const currentItem = useDataByFSID(
		item && (item as PlainData).fsid ? (item as PlainData).fsid : (item as FSID | null),
	)

	if (!currentItem || !data) return []

	return data.filter(item => item.parent === currentItem.fsid)
}
