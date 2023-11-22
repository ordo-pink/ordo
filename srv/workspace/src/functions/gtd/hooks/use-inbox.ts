// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PlainData } from "@ordo-pink/data"
import { useSharedContext } from "@ordo-pink/frontend-core"
import { useEffect, useState } from "react"

export const useInbox = () => {
	const { data } = useSharedContext()

	const [inboxItems, setInboxItems] = useState<PlainData[]>([])

	useEffect(() => {
		if (!data) return

		const items = [] as PlainData[]

		const potentialInboxItems = data.filter(item => item.labels.includes("gtd"))

		potentialInboxItems.forEach(item => {
			if (!data.some(i => i.parent === item.fsid)) items.push(item)
		})

		setInboxItems(items)
	}, [data])

	return inboxItems
}
