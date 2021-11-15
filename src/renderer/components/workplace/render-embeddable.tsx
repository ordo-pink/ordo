import React from "react"
import { Kanban } from "../embeddable/kanban"

const components: Record<string, React.FunctionComponent> = {
	Kanban,
}

export const isEmbeddableComponent = (line: string): boolean =>
	/^<[A-Z][a-zA-Zа-яА-Я";/=\-[\]{}.,'/ ]+\/>/.test(line)

export const renderEmbeddable = (line: string): React.ReactElement => {
	try {
		const attributes = line.match(/(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g)

		const componentName = line.match(/<([^\s>]+)(\s|>)+/)[1]
		const Component = components[componentName]

		if (!Component) {
			return
		}

		const props = (attributes || []).reduce((acc, v) => {
			const pair = v.split("=")
			acc[pair[0]] = pair[1].slice(1, -1)
			return acc
		}, {} as Record<string, string>)

		return <Component {...props} />
	} catch (e) {
		return (
			<div
				className=""
				dangerouslySetInnerHTML={{
					__html: `<p class="text-red-700">Error loading component: ${e.message}</p>`,
				}}
			/>
		)
	}
}
