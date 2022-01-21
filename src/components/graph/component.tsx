import React from "react"

import {
	hierarchy as createHierarchy,
	forceSimulation,
	forceLink,
	forceManyBody,
	forceX,
	forceY,
	SimulationLinkDatum,
	SimulationNodeDatum,
	Simulation,
	drag as d3Drag,
	zoom,
	select,
} from "d3"
import { OrdoFile } from "../../application/types"
import { useAppSelector } from "../../common/store-hooks"

const drag = (simulation: Simulation<SimulationNodeDatum, undefined>) =>
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

export const Graph = React.memo(() => {
	const ref = React.useRef(null)

	const tree = useAppSelector((state) => state.application.tree)

	React.useEffect(() => {
		if (!ref || !tree) {
			return
		}

		const hierarchy = createHierarchy(tree)

		const links = hierarchy.links()
		const nodes = hierarchy.descendants()

		const simulation: Simulation<SimulationNodeDatum, undefined> = forceSimulation(nodes as any)
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

		const container = select(ref.current)

		container
			.attr(
				"viewBox",
				`${-window.innerWidth / 2}, ${-window.innerHeight / 2}, ${window.innerWidth}, ${window.innerHeight}`,
			)
			.attr("class", "font-light text-xs")
			.call(zoom().on("zoom", (e) => container.attr("transform", e.transform)) as any)

		const link = container
			.append("g")
			.attr("stroke", "#999")
			.attr("stroke-width", 0.2)
			.attr("stroke-opacity", 0.6)
			.selectAll("line")
			.data(links)
			.join("line")
			.attr("stroke", (d: any) => {
				// if (d.source.data.type === "tag") {
				// 	return "#EAB464"
				// }

				// if (d.pageRelation) {
				// 	return "#DCCCBB"
				// }

				return "#646E78"
			})

		const node = container
			.append("g")
			.attr("fill", "#fff")
			.attr("stroke", "#fff")
			.selectAll("g")
			.data(nodes)
			.join("g")
			.attr("class", (d: any) => (d.data.type !== "folder" ? "cursor-pointer" : null))
			.attr("stroke-width", 0.5)

			.call(drag(simulation) as any)
			.on("click", (_, n: any) => {
				// TODO
			})

		node
			.append("circle")
			.attr("stroke", (d) => (d.data.type === "folder" ? "#333" : "#fff"))
			.attr("class", (d) => {
				if (d.data.type === "folder") {
					return `text-${d.data.color}-600 fill-current`
				} else if (d.data.type === "image") {
					return "text-blue-200 fill-current"
				} else if ((d.data as unknown as OrdoFile).size === 0) {
					return "text-rose-100 fill-current"
				}

				return "text-rose-400 fill-current"
			})
			.attr("r", 3.5)
			.attr("title", (d: any) => d.data.readableName)

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
	}, [tree])

	return <svg className="-z-10" ref={ref} width={window.innerWidth} height={window.innerHeight} />
})
