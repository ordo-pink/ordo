// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PlainData } from "@ordo-pink/data"
import { useSharedContext } from "@ordo-pink/frontend-core"
import { useEffect, useRef, useState } from "react"
import Links from "./links.component"
import Links3D from "./3d-links.component"
import { useRouteParams } from "$hooks/use-route-params.hook"
import { useWorkspaceWidth } from "$hooks/use-workspace-width.hook"
import Links2D from "./2d-links.component"
import { OrdoButtonPrimary } from "$components/buttons/buttons"

export default function LinksWorkspace() {
	const { data } = useSharedContext()
	const { label } = useRouteParams<{ label: string }>()
	const { workspaceWidth } = useWorkspaceWidth()

	const [is3D, setIs3D] = useState(false)

	const [nodes, setNodes] = useState<{ id: string; data?: PlainData }[]>([])
	const [links, setLinks] = useState<
		{ target: string; source: string; type: "child" | "label" | "link" }[]
	>([])

	useEffect(() => {
		if (!data) return

		const tmpNodes = [] as typeof nodes
		const tmpLinks = [] as typeof links
		const relevantData = label ? data.filter(d => d.labels.includes(label)) : data

		relevantData.forEach(item => {
			if (!tmpNodes.some(n => n.id === item.fsid)) tmpNodes.push({ id: item.fsid, data: item })

			if (item.parent) {
				if (!tmpNodes.some(n => n.id === item.parent)) {
					const parent = data.find(n => n.fsid === item.parent)!
					tmpNodes.push({ id: parent?.fsid, data: parent })
				}

				tmpLinks.push({ source: item.fsid, target: item.parent, type: "child" })
			}

			if (item.labels.length > 0) {
				item.labels.forEach(id => {
					if (!tmpNodes.some(node => node.id === id)) tmpNodes.push({ id })
					tmpLinks.push({ source: item.fsid, target: id, type: "label" })
				})
			}

			if (item.links.length > 0) {
				item.links.forEach(id => {
					if (!tmpNodes.some(node => node.id === id)) {
						const item = data.find(n => n.fsid === id)
						tmpNodes.push({ id, data: item })
					}
					tmpLinks.push({ source: item.fsid, target: id, type: "link" })
				})
			}
		})

		setNodes(tmpNodes)
		setLinks(tmpLinks)
	}, [data, label])

	return (
		<div className="h-[calc(100vh-1rem)] relative" style={{ width: workspaceWidth }}>
			<div className="absolute top-4 flex justify-center space-x-2 w-full z-50">
				<OrdoButtonPrimary onClick={() => setIs3D(false)} inverted={is3D}>
					2D
				</OrdoButtonPrimary>
				<OrdoButtonPrimary onClick={() => setIs3D(true)} inverted={!is3D}>
					3D
				</OrdoButtonPrimary>
			</div>
			{is3D ? <Links3D nodes={nodes} links={links} /> : <Links2D nodes={nodes} links={links} />}
		</div>
	)
}
