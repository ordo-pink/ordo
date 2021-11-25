import React from "react"

import { isEmbeddableComponent } from "./render-embeddable"
import { isEmbeddableContent } from "./render-embeddable-content"

export const applyLineStyling = (line: string): JSX.Element => {
	line = line
		.replace(/\*\*([^**]+)\*\*/g, (value) => `<strong>${value}</strong>`)
		.replace(/_([^_]+)_/g, (value) => `<em>${value}</em>`)
		.replace(/~~([^~~]+)~~/g, (value) => `<strike>${value}</strike>`)
		.replace(
			/`([^`]+)`/g,
			(value) => `<code class="bg-pink-200 p-1 rounded-lg shadow-sm">${value}</code>`,
		)
		.replace(
			/\[\[([^[\]]+)\]\]/g,
			(value) =>
				`<span class="text-blue-600 underline cursor-pointer" onclick="window.dispatchEvent(new CustomEvent('set-current-file', { detail: { path: '${value
					.replace("[[", "")
					.replace("]]", "")}' }}))">${value}</span>`,
		)
		.replace(/#[^\s](\w+[/-_]?)+/g, (value) => `<span class="text-purple-700">${value}</span>`)

	let transformed

	if (isEmbeddableContent(line)) {
		return <span className="text-sm font-mono text-gray-500">{line}</span>
	}

	if (isEmbeddableComponent(line)) {
		return <span className="text-sm font-mono text-gray-500">{line}</span>
	}

	if (line.startsWith("# ")) {
		transformed = <h1 className="text-4xl" dangerouslySetInnerHTML={{ __html: line }} />
	} else if (line.startsWith("## ")) {
		transformed = <h2 className="text-3xl" dangerouslySetInnerHTML={{ __html: line }} />
	} else if (line.startsWith("### ")) {
		transformed = <h3 className="text-2xl" dangerouslySetInnerHTML={{ __html: line }} />
	} else if (line.startsWith("#### ")) {
		transformed = <h4 className="text-xl" dangerouslySetInnerHTML={{ __html: line }} />
	} else if (line.startsWith("##### ")) {
		transformed = <h5 className="text-lg" dangerouslySetInnerHTML={{ __html: line }} />
	} else if (line.startsWith("> ")) {
		transformed = (
			<blockquote
				className="border-l-2 border-gray-600 pl-2"
				dangerouslySetInnerHTML={{ __html: line }}
			/>
		)
	} else {
		transformed = <span dangerouslySetInnerHTML={{ __html: line }} />
	}

	return <span className="whitespace-pre-wrap leading-7">{transformed}</span>
}
