// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PlainData } from "@ordo-pink/data"
import { useSharedContext } from "@ordo-pink/frontend-core"
import { useEffect, useState } from "react"
import { useRouteParams } from "$hooks/use-route-params.hook"
import { useWorkspaceWidth } from "$hooks/use-workspace-width.hook"
import { useIsDarkTheme } from "$hooks/use-is-dark-theme.hook"
import { useRef } from "react"
import { ForceGraph3D } from "react-force-graph"
import { Either } from "@ordo-pink/either"
import "./3d-links.component.css"

export default function LinksWidget() {
	const { data } = useSharedContext()
	const { label } = useRouteParams<{ label: string }>()
	const { workspaceWidth } = useWorkspaceWidth()

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

// const extraRenderers = [new CSS2DRenderer()]

const DarkThemeColors = {
	LABEL_LINK: "#8b5cf6",
	LABEL_NODE: "#2e1065",
	CHILD_LINK: "#e5e5e5",
	CHILD_NODE: "#fafafa",
	LINK: "#ea580c",
}

const LightThemeColors = {
	LABEL_LINK: "#8b5cf6",
	LABEL_NODE: "#2e1065",
	CHILD_LINK: "#262626",
	CHILD_NODE: "#171717",
	LINK: "#ea580c",
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
