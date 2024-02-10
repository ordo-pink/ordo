import { useEffect, useState } from "react"

import { useData, useRouteParams, useWorkspaceWidth } from "@ordo-pink/frontend-react-hooks"
import { type PlainData } from "@ordo-pink/data"

import OrdoButton from "@ordo-pink/frontend-react-components/button"

import Graph2D from "./graph-2d"
import Graph3D from "./graph-3d"

export default function LinksWorkspace() {
	const data = useData()
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

		data.forEach(item => {
			if (!tmpNodes.some(n => n.id === item.fsid)) tmpNodes.push({ id: item.fsid, data: item })

			if (item.parent) {
				if (!tmpNodes.some(n => n.id === item.parent)) {
					const parent = data.find(n => n.fsid === item.parent)
					if (!parent) return
					tmpNodes.push({ id: parent.fsid, data: parent })
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
						if (!item) return
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
		<div className="relative h-[calc(100vh-1px)] overflow-hidden" style={{ width: workspaceWidth }}>
			<div className="absolute top-4 z-50 flex w-full justify-center space-x-2">
				<OrdoButton.Primary onClick={() => setIs3D(false)} inverted={is3D}>
					2D
				</OrdoButton.Primary>

				<OrdoButton.Primary onClick={() => setIs3D(true)} inverted={!is3D}>
					3D
				</OrdoButton.Primary>
			</div>

			{is3D ? <Graph3D nodes={nodes} links={links} /> : <Graph2D nodes={nodes} links={links} />}
		</div>
	)
}
