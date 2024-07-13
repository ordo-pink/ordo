// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { useEffect, useState } from "react"

import {
	useCommands,
	useData,
	useRouteParams,
	useWorkspaceWidth,
} from "@ordo-pink/frontend-react-hooks"
import { type PlainData } from "@ordo-pink/data"

import OrdoButton from "@ordo-pink/frontend-react-components/button"

import Graph2D from "../components/graph-2d"
import Graph3D from "../components/graph-3d"

export default function LinksWorkspace() {
	const commands = useCommands()
	const data = useData()
	const { label } = useRouteParams<{ label: string }>()
	const { workspaceWidth } = useWorkspaceWidth()

	const [is3D, setIs3D] = useState(false)

	const [nodes, setNodes] = useState<{ id: string; data?: PlainData }[]>([])
	const [links, setLinks] = useState<
		{ target: string; source: string; type: "child" | "label" | "link" }[]
	>([])

	useEffect(() => {
		const title = label ? `Граф связей для метки #${label}` : "Граф связей"
		commands.emit<cmd.application.set_title>("application.set-title", title)
	}, [label, commands])

	useEffect(() => {
		if (!data) return

		const tmpNodes = [] as typeof nodes
		const tmpLinks = [] as typeof links

		const relevantData = label ? data.filter(d => d.labels.includes(label)) : data

		relevantData.forEach(item => {
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
