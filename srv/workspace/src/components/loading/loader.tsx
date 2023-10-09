// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useLayoutEffect, useRef } from "react"
import "./loader.css"

const getParentBackground = (element: Element) => {
	let color = "rgba(0, 0, 0, 0)"

	while (element.parentElement) {
		color = window.getComputedStyle(element.parentElement).backgroundColor
		console.log(color)

		if (color !== "rgba(0, 0, 0, 0)") break

		element = element.parentElement
	}

	return color
}

export const Loader = () => {
	const ref = useRef<HTMLDivElement>(null)

	useLayoutEffect(() => {
		if (!ref.current) return

		ref.current.style.setProperty("--background", getParentBackground(ref.current))
	}, [ref.current])

	return (
		<div ref={ref} className="loader">
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>
	)
}
