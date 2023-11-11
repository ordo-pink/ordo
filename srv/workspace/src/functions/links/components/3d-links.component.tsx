// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useWorkspaceWidth } from "$hooks/use-workspace-width.hook"
import { PlainData } from "@ordo-pink/data"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { useRef } from "react"
import { ForceGraph3D } from "react-force-graph"

type P = {
	nodes: { id: string; data?: PlainData }[]
	links: { target: string; source: string; type: "child" | "label" | "link" }[]
}
export default function Links3D({ nodes, links }: P) {
	const { commands } = useSharedContext()
	const { workspaceWidth } = useWorkspaceWidth()
	const ref = useRef<any>()

	return (
		<ForceGraph3D
			ref={ref}
			width={workspaceWidth}
			graphData={{ nodes, links }}
			backgroundColor="rgba(0,0,0,0)"
			nodeRelSize={5}
			nodeColor={node => (node.data ? "#737373" : "#2e1065")}
			linkColor={link =>
				link.type === "label" ? "#a855f7" : link.type === "link" ? "#ea580c" : "#fff"
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
