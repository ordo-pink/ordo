// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PlainData } from "@ordo-pink/data"
import { useSharedContext } from "@ordo-pink/frontend-core"
import { useEffect, useState } from "react"
import Links from "./links.component"

export default function LinksWorkspace() {
	const { data, route } = useSharedContext()

	const [nodes, setNodes] = useState<{ id: string; data?: PlainData }[]>([])
	const [links, setLinks] = useState<
		{ target: string; source: string; type: "child" | "label" | "link" }[]
	>([])

	useEffect(() => {
		if (!data) return

		const tmpNodes = [] as typeof nodes
		const tmpLinks = [] as typeof links
		const relevantData = route?.params?.label
			? data.filter(d => d.labels.includes(route?.params?.label))
			: data

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
	}, [data, route?.params?.label])

	return (
		<div className="w-full h-screen">
			<Links nodes={nodes} links={links} />
		</div>
	)
}
