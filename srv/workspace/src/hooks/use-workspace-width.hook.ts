// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useSharedContext } from "@ordo-pink/core"
import { useEffect, useState } from "react"

export const useWorkspaceWidth = () => {
	const { workspaceSplitSize } = useSharedContext()
	const [documentWidth, setDocumentWidth] = useState(0)
	const [sizes, setSizes] = useState<{ sidebarWidth: number; workspaceWidth: number }>({
		sidebarWidth: 0,
		workspaceWidth: 0,
	})

	useEffect(() => {
		const setTotalWidth = () => setDocumentWidth(window.innerWidth)

		document.addEventListener("resize", setTotalWidth)

		setTotalWidth()

		return () => document.removeEventListener("resize", setTotalWidth)
	}, [])

	useEffect(() => {
		setSizes({
			sidebarWidth: (documentWidth * workspaceSplitSize[0]) / 100 - 40,
			workspaceWidth: (documentWidth * workspaceSplitSize[1]) / 100 - 40,
		})
	}, [documentWidth, workspaceSplitSize[0]])

	return sizes
}
