// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { FSID, PlainData } from "@ordo-pink/data"
import { useSharedContext } from "@ordo-pink/frontend-core"
import { useDataByFSID } from "./use-data.hook"

export const useParentChain = (fsid: FSID) => {
	const { data } = useSharedContext()
	let currentItem = useDataByFSID(fsid)

	const parentChain = [] as PlainData[]

	if (!data || !currentItem || currentItem.parent === null) return parentChain

	while (currentItem && currentItem.parent !== null) {
		const parent = data?.find(x => x.fsid === currentItem?.parent) ?? null

		if (parent) parentChain.push(parent)

		currentItem = parent
	}

	return parentChain.reverse()
}
