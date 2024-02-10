import { ForceGraph2D } from "react-force-graph"
import { useRef } from "react"

import { useCommands, useIsDarkTheme, useWorkspaceWidth } from "@ordo-pink/frontend-react-hooks"
import { PlainData } from "@ordo-pink/data"

import { DarkThemeColors, LightThemeColors } from "../../constants"

import "./graph-2d.css"

type P = {
	nodes: { id: string; data?: PlainData }[]
	links: { target: string; source: string; type: "child" | "label" | "link" }[]
}
export default function Graph2D({ nodes, links }: P) {
	const commands = useCommands()
	const { workspaceWidth } = useWorkspaceWidth()
	const ref = useRef<any>()
	const isDarkTheme = useIsDarkTheme()

	const colors = isDarkTheme ? DarkThemeColors : LightThemeColors

	return (
		<ForceGraph2D
			ref={ref}
			width={workspaceWidth + 50}
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
			linkWidth={0.3}
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
		/>
	)
}
