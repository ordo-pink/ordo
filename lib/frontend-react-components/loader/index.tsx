// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useLayoutEffect, useRef } from "react"

import "./loader.css"
import { Switch } from "@ordo-pink/switch"

const getParentBackground = (element: Element) => {
	let color = "rgba(0, 0, 0, 0)"

	while (element.parentElement) {
		color = window.getComputedStyle(element.parentElement).backgroundColor

		if (color !== "rgba(0, 0, 0, 0)") break

		element = element.parentElement
	}

	return color
}

type P = { size?: "s" | "m" | "l" }
export default function Loader({ size }: P) {
	const ref = useRef<HTMLDivElement>(null)
	const className = Switch.of(size)
		.case("s", () => "loader small")
		.case("l", () => "loader large")
		.default(() => "loader")

	useLayoutEffect(() => {
		if (!ref.current) return

		ref.current.style.setProperty("--background", getParentBackground(ref.current))
	}, [ref])

	return (
		<div ref={ref} className={className}>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>
	)
}
