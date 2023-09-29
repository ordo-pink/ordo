// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { FSID, PlainData } from "@ordo-pink/data"
import { useSharedContext } from "@ordo-pink/frontend-core"
import { useData } from "./use-data"

export const useChildren = (fsid: FSID | null) => {
	const { data } = useSharedContext()
	const currentItem = useData(fsid)

	if (!currentItem || !data) return []

	return currentItem.children.map(child => data.find(x => x.fsid === child)) as PlainData[]
}
