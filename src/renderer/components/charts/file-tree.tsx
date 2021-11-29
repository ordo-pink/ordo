import type { SimulationNodeDatum, SimulationLinkDatum, HierarchyLink, HierarchyNode } from "d3"

import React from "react"
import {
	hierarchy as createHierarchy,
	forceSimulation,
	forceLink,
	forceManyBody,
	forceX,
	forceY,
	Simulation,
	drag as d3Drag,
	zoom,
	select,
} from "d3"

import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { setCurrentPath, createFileOrFolder } from "../../features/file-tree/file-tree-slice"
import { OrdoFolder, Tag } from "../../../global-context/types"

type TagNode = {
	readableName: string
	isFile: boolean
	path: string
	type: "tag"
	data: {
		isFile: boolean
		readableName: string
		path: string
		type: "tag"
	}
}

const drag = (simulation: Simulation<SimulationNodeDatum, undefined>) =>
	d3Drag()
		.on("start", (event, d: SimulationNodeDatum) => {
			if (!event.active) {
				simulation.alphaTarget(0.3).restart()
			}

			d.fx = d.x
			d.fy = d.y
		})
		.on("drag", (event, d: SimulationNodeDatum) => {
			d.fx = event.x
			d.fy = event.y
		})
		.on("end", (event, d: SimulationNodeDatum) => {
			if (!event.active) {
				simulation.alphaTarget(0)
			}

			d.fx = null
			d.fy = null
		})

export const FileTreeGraph: React.FC = () => {
	const dispatch = useAppDispatch()
	const data = useAppSelector((state) => state.fileTree.tree)

	const svgRef = React.useRef(null)

	React.useEffect(() => {
		if (!svgRef || !data) {
			return
		}

		const hierarchy = createHierarchy(data)

		const links: Array<
			HierarchyLink<OrdoFolder | TagNode> & {
				pageRelation?: boolean
				index?: number
				type?: string
			}
		> = hierarchy.links()
		const nodes: Array<HierarchyNode<OrdoFolder> | HierarchyNode<TagNode>> = hierarchy.descendants()

		// data.links.forEach((link) => {
		// 	let target

		// 	const source = nodes.find((node) => node.data.path === link.source)
		// 	const parentNode = nodes.find(
		// 		(node) => node.data.path === link.target.slice(0, link.target.lastIndexOf("/")),
		// 	)

		// 	if (!link.exists) {
		// 		const readableName = link.target.slice(
		// 			link.target.lastIndexOf("/") + 1,
		// 			link.target.lastIndexOf("."),
		// 		)

		// 		target = {
		// 			path: link.target,
		// 			data: {
		// 				readableName,
		// 				path: link.target,
		// 				type: "absent",
		// 				parentNode,
		// 			},
		// 		} as unknown as HierarchyNode<OrdoFolder>

		// 		nodes.push(target)
		// 	} else {
		// 		target = nodes.find((node) => node.data.path === link.target)
		// 	}

		// 	links.push({
		// 		source,
		// 		target,
		// 		pageRelation: true,
		// 		index: links.length,
		// 	})

		// 	if (parentNode) {
		// 		links.push({
		// 			source: parentNode,
		// 			target,
		// 			index: links.length,
		// 		})
		// 	}
		// })

		// data.tags.forEach((tag: Tag) => {
		// 	const node = {
		// 		readableName: tag.name,
		// 		path: tag.name,
		// 		type: "tag",
		// 		data: {
		// 			readableName: tag.name,
		// 			path: tag.name,
		// 			type: "tag",
		// 		},
		// 	} as unknown as HierarchyNode<TagNode>

		// 	nodes.push(node)

		// 	tag.children.forEach((child) => {
		// 		links.push({
		// 			source: node,
		// 			target: nodes.find((n) => n.data.path === child.path),
		// 			index: links.length,
		// 		})
		// 	})
		// })

		const simulation: Simulation<SimulationNodeDatum, undefined> = forceSimulation(
			nodes as unknown as SimulationNodeDatum[],
		)
			.force(
				"link",
				forceLink(links as unknown as SimulationLinkDatum<SimulationNodeDatum>[])
					.id((d: any) => d.data.path)
					.distance(50)
					.strength(2),
			)
			.force("change", forceManyBody().strength(-100))
			.force("x", forceX())
			.force("y", forceY())

		const container = select(svgRef.current)

		container
			.attr(
				"viewBox",
				`${-window.innerWidth / 2}, ${-window.innerHeight / 2}, ${window.innerWidth}, ${
					window.innerHeight
				}`,
			)
			.attr("class", "font-light text-xs")
			.call(zoom().on("zoom", (e) => container.attr("transform", e.transform)))

		const link = container
			.append("g")
			.attr("stroke", "#999")
			.attr("stroke-width", 0.2)
			.attr("stroke-opacity", 0.6)
			.selectAll("line")
			.data(links)
			.join("line")
			.attr("stroke", (d) => {
				// if (d.source.data.type === "tag") {
				// 	return "#EAB464"
				// }

				if (d.pageRelation) {
					return "#DCCCBB"
				}

				return "#646E78"
			})
		// .attr("stroke-width", (d) => (d.source.data.type === "tag" || d.pageRelation ? 0.8 : null))

		const node = container
			.append("g")
			.attr("fill", "#fff")
			.attr("stroke", "#fff")
			.selectAll("g")
			.data(nodes)
			.join("g")
			.attr("class", (d: any) =>
				d.data.isFile || d.data.type === "absent" ? "cursor-pointer" : null,
			)
			.attr("stroke-width", 0.5)

			.call(drag(simulation) as any)
			.on("click", (_, n: any) => {
				if (n.data.isFile) {
					dispatch(setCurrentPath(n.data.path))
				} else if (n.data.type === "absent" && n.data.parentNode) {
					dispatch(createFileOrFolder({ name: n.data.readableName, node: n.data.parentNode.data }))
					dispatch(setCurrentPath(n.data.path))
				}
			})

		node
			.append("circle")
			.attr("fill", (d) => {
				if (d.data.isFile) {
					return "#8D98A7"
				}

				// if (d.data.type === "tag") {
				// 	return "#EAB464"
				// }

				// if (d.data.type === "absent") {
				// 	return "#DA4167"
				// }

				return "#646E78"
			})
			.attr("stroke", (d) => (d.data.isFile ? null : "#fff"))
			.attr("r", 3.5)

		node
			.append("text")
			.attr("x", 0)
			.attr("text-anchor", "middle")
			.attr("y", "3em")
			.attr("stroke-width", 0)
			.attr("fill", "#333")
			.attr("style", "font-size: 2px")
			.text((d) => d.data.readableName)

		simulation.on("tick", () => {
			link
				.attr("x1", (d: any) => d.source.x)
				.attr("y1", (d: any) => d.source.y)
				.attr("x2", (d: any) => d.target.x)
				.attr("y2", (d: any) => d.target.y)

			node.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
		})
	}, [svgRef.current, data])

	return <svg ref={svgRef} width={window.innerWidth} height={window.innerHeight} />
}
