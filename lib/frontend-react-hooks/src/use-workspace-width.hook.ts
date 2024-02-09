import { useEffect, useState } from "react"

import { EnabledSidebar, sidebar$ } from "@ordo-pink/frontend-stream-sidebar"
import { Either } from "@ordo-pink/either"

import { useStrictSubscription } from "./use-strict-subscription.hook"

export const useWorkspaceWidth = () => {
	const sidebar = useStrictSubscription(sidebar$, { disabled: true })

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
		Either.fromBoolean(
			() => !sidebar.disabled,
			() => sidebar as EnabledSidebar,
		)
			.map(sidebar => sidebar.sizes)
			.fold(
				() => {
					setSizes({ sidebarWidth: 0, workspaceWidth: documentWidth - 40 })
				},
				sizes =>
					setSizes({
						sidebarWidth: (documentWidth * sizes[0]) / 100 - 40,
						workspaceWidth: (documentWidth * sizes[1]) / 100 - 40,
					}),
			)
	}, [documentWidth, sidebar])

	return sizes
}