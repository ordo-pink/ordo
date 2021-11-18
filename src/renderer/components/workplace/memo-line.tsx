import React from "react"

import { isEmbeddableComponent, renderEmbeddable } from "./render-embeddable"
import { isEmbeddableContent, EmbeddableContent } from "./render-embeddable-content"
import { applyLineStyling } from "./apply-line-styling"
import { Conditional } from "../conditional"

export const MemoLine = React.memo<{
	line: string
	index: number
	content: string[]
	currentLine: number
	onClick: (index: number) => void
	onChange: (index: number) => void
	onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void
}>(
	({ line, index, content, currentLine, onClick, onChange, onKeyDown }) => {
		const [collapsed, setCollapsed] = React.useState(true)
		const icon = collapsed ? "▶" : "▼"

		return (
			<div key={line ? line : index}>
				<div className={`w-full flex items-center ${index === currentLine && "bg-gray-200"}`}>
					<Conditional when={isEmbeddableComponent(line) || isEmbeddableContent(line)}>
						<span className="w-4 pl-2 cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
							{icon}
						</span>
						<span className="w-4" />
					</Conditional>

					<div className="text-right w-16 px-2 text-gray-700 dark:text-gray-300 font-mono">
						{index + 1}
					</div>
					<div
						style={{ maxWidth: "1000px" }}
						className="px-2 w-full border-l dark:border-gray-900 border-gray-300 "
					>
						<div
							// ref={ref}
							className="w-full outline-none"
							contentEditable={true}
							data-id={index}
							onClick={() => onClick(index)}
							onInput={() => onChange(index)}
							onKeyDown={onKeyDown}
							suppressContentEditableWarning={true}
						>
							{applyLineStyling(line)}
						</div>
					</div>
				</div>

				<Conditional when={isEmbeddableContent(line) && !collapsed}>
					<div className="p-2">
						<EmbeddableContent currentContent={content.join("\n")} line={line} />
					</div>
				</Conditional>

				<Conditional when={isEmbeddableComponent(line) && !collapsed}>
					<div className="p-2">{renderEmbeddable(line)}</div>
				</Conditional>
			</div>
		)
	},
	(a, b) => a.line === b.line && a.currentLine === b.currentLine,
)
