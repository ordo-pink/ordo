// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { THeadingProps } from "./heading.types"

import { HeadingView } from "./heading.view"

import "./heading.css"

export default function Heading({
	level,
	center,
	uppercase,
	children,
	trim,
	styledFirstLetter,
}: THeadingProps): JSX.Element {
	const headingLevel = level ?? "1"
	const className = `heading heading-${headingLevel}`
		.concat(center ? " center" : "")
		.concat(uppercase ? " upper" : "")
		.concat(trim ? " trim" : "")
		.concat(styledFirstLetter ? " styled-first-letter" : "")

	return (
		<HeadingView level={headingLevel} className={className}>
			{children}
		</HeadingView>
	)
}
