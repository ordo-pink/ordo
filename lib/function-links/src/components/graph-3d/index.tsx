import { ForceGraph3D } from "react-force-graph"
import { useRef } from "react"

import { useCommands, useIsDarkTheme, useWorkspaceWidth } from "@ordo-pink/frontend-react-hooks"
import { type PlainData } from "@ordo-pink/data"

import { DarkThemeColors, LightThemeColors } from "../../constants"

import "./graph-3d.css"

type P = {
	nodes: { id: string; data?: PlainData }[]
	links: { target: string; source: string; type: "child" | "label" | "link" }[]
}
export default function Graph3D({ nodes, links }: P) {
	const commands = useCommands()
	const { workspaceWidth } = useWorkspaceWidth()
	const ref = useRef<any>()
	const isDarkTheme = useIsDarkTheme()

	const colors = isDarkTheme ? DarkThemeColors : LightThemeColors

	return (
		<ForceGraph3D
			ref={ref}
			forceEngine="d3"
			// extraRenderers={extraRenderers as any}
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
			// onNodeDragEnd={node => {
			// 	node.fx = node.x
			// 	node.fy = node.y
			// 	node.fz = node.z
			// }}
			showNavInfo={false}
			// onEngineTick={() => {
			// 	console.log(ref.current.scene())
			// 	console.log(ref.current.controls().target.distanceTo(ref.current.scene().position))
			// }}
			// nodeThreeObjectExtend
			// nodeThreeObject={node => {
			// 	const text = new SpriteText(node.data ? node.data.name : `#${node.id}`)
			// 	text.translateY(-12)
			// 	text.color = node.data ? colors.CHILD_NODE : colors.LABEL_NODE
			// 	text.fontFace = "Jost"
			// 	text.backgroundColor = "#fff"
			// 	text.padding = 2
			// 	text.borderRadius = 5
			// 	return text
			// const element = document.createElement("div")

			// element.textContent = node.data ? node.data.name : node.id
			// element.style.color = node.data ? colors.CHILD_NODE : colors.LABEL_NODE
			// element.className = "mt-6 w-24 text-center"

			// return new CSS2DObject(element)
			// }}
		/>
	)
}
