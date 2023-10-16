import { FSID, PlainData } from "@ordo-pink/data"
import { Either } from "@ordo-pink/either"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { noop } from "@ordo-pink/tau"
import * as d3 from "d3"
import { useEffect, useLayoutEffect, useRef, useState } from "react"

type P = {
	nodes: { id: string; data?: PlainData }[]
	links: { target: string; source: string; type: "child" | "label" | "link" }[]
}
export default function Links({ nodes, links }: P) {
	const wrapperRef = useRef<SVGSVGElement>(null)
	const { commands, data } = useSharedContext()

	useEffect(() => {
		if (!data) return

		const drag = (simulation: d3.Simulation<any, any>) => {
			return d3
				.drag()
				.on("start", (event, d: any) => {
					if (!event.active) simulation.alphaTarget(0.3).restart()
					d.fx = d.x
					d.fy = d.y
				})
				.on("drag", (event, d: any) => {
					d.fx = event.x
					d.fy = event.y
				})
				.on("end", (event, d: any) => {
					if (!event.active) simulation.alphaTarget(0)
					d.fx = null
					d.fy = null
				})
		}

		const simulation = d3
			.forceSimulation(nodes as any)
			.force(
				"link",
				d3
					.forceLink(links)
					.id((d: any) => d.id)
					.distance(50)
					.strength(1),
			)
			.force("charge", d3.forceManyBody().theta(1).strength(-2500))
			.force("x", d3.forceX())
			.force("y", d3.forceY())

		// Create the container SVG.
		const svg = d3
			.select(wrapperRef.current)
			.attr("viewBox", [
				-window.innerWidth / 2,
				-window.innerHeight / 2,
				window.innerWidth,
				window.innerHeight,
			])
			.on("contextmenu", event => {
				event.preventDefault()
				const id = event.srcElement?.__data__?.id
				if (!id) return
				const payload = data.find(item => item.fsid === id)
				commands.emit<cmd.ctxMenu.show>("context-menu.show", { event, payload })
			})
			.call(
				d3.zoom().on("zoom", e => {
					svg.attr("transform", e.transform)
				}) as any,
			)

		// Append links.
		const link = svg
			.append("g")
			.attr("stroke-opacity", 0.2)
			.selectAll("line")
			.data(links)
			.join("line")
			.attr("stroke", l => (l.type === "child" ? "#737373" : "#a855f7"))

		// Append nodes.
		const node = svg
			.append("g")
			.selectAll("circle")
			.data(nodes)
			.join("circle")
			.attr("r", 10)
			.attr("class", d => (d.data ? "fill-neutral-100 cursor-grab" : "fill-purple-500 cursor-grab"))
			.call(drag(simulation) as any)

		node.append("title").text(d => d.data?.name ?? d.id)

		var label = svg
			.append("g")
			.selectAll("text")
			.data(nodes)
			.enter()
			.append("text")
			.text(d => d.data?.name ?? d.id)
			.attr("x", 20)
			.attr("class", "fill-neutral-500 cursor-grab text-xs")
			.call(drag(simulation) as any)

		simulation.on("tick", () => {
			link
				.attr("x1", (d: any) => d.source.x - 12)
				.attr("y1", (d: any) => d.source.y)
				.attr("x2", (d: any) => d.target.x - 12)
				.attr("y2", (d: any) => d.target.y)

			node.attr("cx", (d: any) => d.x - 14).attr("cy", (d: any) => d.y - 3)
			label.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y)
		})

		return () => {
			if (!wrapperRef.current) return
			wrapperRef.current.innerHTML = ""
		}
	}, [data, nodes, links])

	return <svg ref={wrapperRef} className="w-full h-full overflow-none"></svg>
}
