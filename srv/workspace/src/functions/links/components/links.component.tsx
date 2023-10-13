import { Either } from "@ordo-pink/either"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { noop } from "@ordo-pink/tau"
import * as d3 from "d3"
import { useEffect, useLayoutEffect, useRef, useState } from "react"

export default function LinksComponent() {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
	const wrapperRef = useRef<SVGSVGElement>(null)
	const { commands, data } = useSharedContext()

	useLayoutEffect(() => {
		Either.fromNullable(wrapperRef.current)
			.map(div => div.getBoundingClientRect())
			.map(({ width, height }) => ({ width: Math.round(width), height: Math.round(height) }))
			.fold(noop, setDimensions)
	}, [wrapperRef.current])

	useEffect(() => {
		if (!data) return

		const nodes = data.map(data => ({ id: data.fsid, data }))
		const links = data.flatMap(item =>
			item.children.map(child => ({ source: item.fsid, target: child })),
		)

		const drag = (simulation: d3.Simulation<any, any>) => {
			return d3
				.drag()
				.on("start", (event, d) => {
					if (!event.active) simulation.alphaTarget(0.3).restart()
					d.fx = d.x
					d.fy = d.y
				})
				.on("drag", (event, d) => {
					d.fx = event.x
					d.fy = event.y
				})
				.on("end", (event, d) => {
					if (!event.active) simulation.alphaTarget(0)
					d.fx = null
					d.fy = null
				})
		}

		const simulation = d3
			.forceSimulation(nodes)
			.force(
				"link",
				d3
					.forceLink(links)
					.id(d => d.id)
					.distance(50)
					.strength(1),
			)
			.force("charge", d3.forceManyBody().theta(1).strength(-900))
			.force(
				"collision",
				d3.forceCollide().radius(function (d) {
					return d.radius
				}),
			)
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
			.call(d3.zoom().on("zoom", e => svg.attr("transform", e.transform)) as any)

		// Append links.
		const link = svg
			.append("g")
			.attr("stroke", "#999")
			.attr("stroke-opacity", 0.6)
			.selectAll("line")
			.data(links)
			.join("line")

		// Append nodes.
		const node = svg
			.append("g")
			.attr("fill", "#fff")
			.selectAll("circle")
			.data(nodes)
			.join("circle")
			.attr("r", 10)
			.call(drag(simulation))

		node.append("title").text(d => d.data.name)

		var label = svg
			.append("g")
			.selectAll("text")
			.data(nodes)
			.enter()
			.append("text")
			.text(d => d.data.name)
			.attr("x", 20)
			.attr("class", "fill-neutral-500 cursor-grab text-xs")
			.call(drag(simulation))

		// const texts = node
		// 	.selectAll(null)
		// 	.append("text")
		// 	.attr("x", 0)
		// 	.attr("y", 0)
		// 	.attr("text-anchor", "middle")
		// 	.attr("stroke-width", 1)
		// 	.attr("fill", "#333")
		// 	.attr("style", "font-size: 25px")
		// 	.text(d => d.data.name)

		simulation.on("tick", () => {
			link
				.attr("x1", d => d.source.x)
				.attr("y1", d => d.source.y)
				.attr("x2", d => d.target.x)
				.attr("y2", d => d.target.y)

			node
				.attr("cx", function (d) {
					return d.x + 5
				})
				.attr("cy", function (d) {
					return d.y - 3
				})

			label
				.attr("x", function (d) {
					return d.x
				})
				.attr("y", function (d) {
					return d.y
				})
		})

		return () => {
			if (!wrapperRef.current) return
			wrapperRef.current.innerHTML = ""
		}
	}, [data])

	return <svg ref={wrapperRef} className="w-full h-screen overflow-none"></svg>
}
