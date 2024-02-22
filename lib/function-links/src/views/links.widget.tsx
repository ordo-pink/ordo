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

import { useEffect, useRef, useState } from "react"
import { ForceGraph3D } from "react-force-graph"

import { useData, useIsDarkTheme, useWorkspaceWidth } from "@ordo-pink/frontend-react-hooks"
import { Either } from "@ordo-pink/either"
import { type PlainData } from "@ordo-pink/data"

import { DarkThemeColors, LightThemeColors } from "../constants"

import "../components/graph-3d/graph-3d.css"

export default function LinksWidget() {
	const data = useData()
	const { workspaceWidth } = useWorkspaceWidth()

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
	}, [data])

	return Either.fromNullable(data)
		.chain(data => Either.fromBoolean(() => data.length > 0).map(() => data))
		.fold(
			() => (
				<div className="text-center">
					<p>Здесь будет карта связей всех ваших файлов.</p>
					<p>Но пока их нет.</p>
				</div>
			),
			() => (
				<div className="relative" style={{ width: workspaceWidth }}>
					<Links3D nodes={nodes} links={links} />
				</div>
			),
		)
}

type P = {
	nodes: { id: string; data?: PlainData }[]
	links: { target: string; source: string; type: "child" | "label" | "link" }[]
}
function Links3D({ nodes, links }: P) {
	const ref = useRef<any>(null)
	const parentRef = useRef<HTMLDivElement>(null)
	const isDarkTheme = useIsDarkTheme()

	const distance = 500
	const colors = isDarkTheme ? DarkThemeColors : LightThemeColors

	const [width, setWidth] = useState(0)

	useEffect(() => {
		Either.fromNullable(parentRef.current).fold(
			() => void 0,
			current => {
				setWidth(current.getBoundingClientRect().width)
			},
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ref.current])

	useEffect(() => {
		ref.current.cameraPosition({ z: distance })

		// camera orbit
		let angle = 0
		const interval = setInterval(() => {
			ref.current.cameraPosition({
				x: distance * Math.sin(angle),
				z: distance * Math.cos(angle),
			})
			angle += Math.PI / 300
		}, 10)

		return () => clearInterval(interval)
	}, [])

	return (
		<div ref={parentRef}>
			<ForceGraph3D
				ref={ref}
				forceEngine="d3"
				width={width > 400 ? 400 : width * 0.7}
				height={width > 400 ? 400 : width * 0.7}
				graphData={{ nodes, links }}
				backgroundColor="rgba(0,0,0,0)"
				nodeRelSize={5}
				nodeColor={node => (node.data ? colors.CHILD_NODE : colors.LABEL_NODE)}
				linkColor={link =>
					link.type === "label"
						? colors.LABEL_LINK
						: link.type === "link"
							? colors.LINK
							: colors.CHILD_LINK
				}
				nodeResolution={20}
				enableNodeDrag={false}
				enableNavigationControls={false}
				showNavInfo={false}
			/>
		</div>
	)
}
