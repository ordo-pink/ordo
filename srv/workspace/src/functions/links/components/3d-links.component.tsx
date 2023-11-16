// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useIsDarkTheme } from "$hooks/use-is-dark-theme.hook"
import { useWorkspaceWidth } from "$hooks/use-workspace-width.hook"
import { PlainData } from "@ordo-pink/data"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { useRef } from "react"
import { ForceGraph3D } from "react-force-graph"
import "./3d-links.component.css"

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
export default function Links3D({ nodes, links }: P) {
	const { commands } = useSharedContext()
	const { workspaceWidth } = useWorkspaceWidth()
	const ref = useRef<any>()
	const isDarkTheme = useIsDarkTheme()

	const colors = isDarkTheme ? DarkThemeColors : LightThemeColors

	return (
		<ForceGraph3D
			ref={ref}
			width={workspaceWidth}
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
			nodeResolution={25}
			nodeLabel={node => (!node.data ? `#${node.id}` : node.data.name)}
			onNodeRightClick={(node, event) =>
				!!node.data &&
				commands.emit<cmd.ctxMenu.show>("context-menu.show", {
					event: {
						...event,
						currentTarget: event.target as any,
						clientX: event.clientX,
						clientY: event.clientY,
					} as any,
					payload: node.data,
				})
			}
			controlType="orbit"
			showNavInfo={false}
		/>
	)
}
