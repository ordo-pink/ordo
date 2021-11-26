import type { Hashed } from "../../../main/apis/hash-response"
import type { ArbitraryFolder } from "../../../global-context/types"

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

const drag = (simulation: Simulation<any, any>) =>
	d3Drag()
		.on("start", (event, d: any) => {
			if (!event.active) {
				simulation.alphaTarget(0.3).restart()
			}

			d.fx = d.x
			d.fy = d.y
		})
		.on("drag", (event, d: any) => {
			d.fx = event.x
			d.fy = event.y
		})
		.on("end", (event, d: any) => {
			if (!event.active) {
				simulation.alphaTarget(0)
			}

			d.fx = null
			d.fy = null
		})

export const FileTreeGraph: React.FC<{ data: Hashed<ArbitraryFolder> }> = ({ data = {} }) => {
	const svgRef = React.useRef(null)

	React.useEffect(() => {
		if (!svgRef) {
			return
		}

		const hierarchy = createHierarchy(data)

		const links: any = hierarchy.links()
		const nodes: any = hierarchy.descendants()

		data.links.forEach((link: any) => {
			let target

			const source = nodes.find((node: any) => node.data.path === link.source)
			const parentNode = nodes.find(
				(node: any) => node.data.path === link.target.slice(0, link.target.lastIndexOf("/")),
			)

			if (!link.exists) {
				const readableName = link.target.slice(
					link.target.lastIndexOf("/") + 1,
					link.target.lastIndexOf("."),
				)

				target = {
					readableName,
					path: link.target,
					type: "absent",
					data: {
						readableName,
						path: link.target,
						type: "absent",
					},
				}

				nodes.push(target)
			} else {
				target = nodes.find((node: any) => node.data.path === link.target)
			}

			links.push({
				source,
				target,
				pageRelation: true,
				index: links.length,
			})

			if (parentNode) {
				links.push({
					source: parentNode,
					target,
					index: links.length,
				})
			}
		})

		data.tags.forEach((tag: any) => {
			const node = {
				readableName: tag.name,
				path: tag.name,
				type: "tag",
				data: {
					readableName: tag.name,
					path: tag.name,
					type: "tag",
				},
			}

			nodes.push(node)

			tag.children.forEach((child: any) => {
				links.push({
					source: node,
					target: nodes.find((n: any) => n.data.path === child.path),
					index: links.length,
				})
			})
		})

		const simulation = forceSimulation(nodes)
			.force(
				"link",
				forceLink(links)
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
			.attr("stroke", (d: any) => {
				if (d.source.type === "tag") {
					return "#EAB464"
				}

				if (d.pageRelation) {
					return "#DCCCBB"
				}

				return "#646E78"
			})
			.attr("stroke-width", (d: any) => (d.source.type === "tag" || d.pageRelation ? 0.8 : null))

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

			.call(drag(simulation))
			.on("click", (_, n: any) => {
				if (n.data.isFile) {
					window.dispatchEvent(
						new CustomEvent("set-current-file", {
							detail: { path: n.data.path },
						}),
					)
				} else if (n.data.type === "absent") {
					window.dispatchEvent(
						new CustomEvent("create-file", {
							detail: { path: n.data.path },
						}),
					)
				}
			})

		node
			.append("circle")
			.attr("fill", (d: any) => {
				if (d.data.isFile) {
					return "#8D98A7"
				}

				if (d.data.type === "tag") {
					return "#EAB464"
				}

				if (d.data.type === "absent") {
					return "#DA4167"
				}

				return "#646E78"
			})
			.attr("stroke", (d: any) => (d.data.isFile ? null : "#fff"))
			.attr("r", 3.5)

		node
			.append("text")
			.attr("x", 0)
			.attr("text-anchor", "middle")
			.attr("y", "3em")
			.attr("stroke-width", 0)
			.attr("fill", "#333")
			.attr("style", "font-size: 2px")
			.text((d: any) => d.data.readableName)

		simulation.on("tick", () => {
			link
				.attr("x1", (d: any) => d.source.x)
				.attr("y1", (d: any) => d.source.y)
				.attr("x2", (d: any) => d.target.x)
				.attr("y2", (d: any) => d.target.y)

			node.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
		})
	}, [svgRef.current, data.hash])

	return <svg ref={svgRef} width={window.innerWidth} height={window.innerHeight} />
}
