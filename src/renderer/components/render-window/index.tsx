import React, { useEffect } from "react"
import { Kanban } from "../embeddable/kanban"
import { List } from "../embeddable/list"

const components = {
	Kanban,
	List,
}

const transpile = (content: string): React.ReactElement[] => {
	const lines: React.ReactElement[] = []

	content.split("\n").forEach((line) => {
		line = line
			.replace(
				/\*\*(.*)\*\*/g,
				(value) => `<strong class="font-bold">${value.replace(/\*\*/g, "")}</strong>`,
			)
			.replace(/_(.*)_/g, (value) => `<em class="font-italic">${value.replace(/_/g, "")}</em>`)
			.replace(
				/~~(.*)~~/g,
				(value) => `<strike class="font-italic">${value.replace(/~~/g, "")}</strike>`,
			)
			.replace(
				/^- \[ \] (.*)/g,
				(value) =>
					`<label><input class="mr-2" type="checkbox" />${value.replace("- [ ] ", "")}</label>`,
			)
			.replace(
				/^- \[x\] (.*)/g,
				(value) =>
					`<label class="line-through"><input class="mr-2" type="checkbox" checked />${value.replace(
						"- [x] ",
						"",
					)}</label>`,
			)
			.replace(/^---$/g, "<hr />")
			.replace(
				/^- \( \) (.*)/g,
				(value) =>
					`<label><input class="mr-2" type="checkbox" />${value.replace("- ( ) ", "")}</label>`,
			)
			.replace(
				/^- \(x\) (.*)/g,
				(value) =>
					`<label class="line-through"><input class="mr-2" type="checkbox" checked />${value.replace(
						"- (x) ",
						"",
					)}</label>`,
			)
			.replace(/^- (.*)/, (value) => `<li>${value.replace("- ", "")}</li>`)

		if (line.startsWith("# ")) {
			lines.push(
				<div
					className=""
					dangerouslySetInnerHTML={{
						__html: `<h1 class="text-5xl">${line.replace(/^# /, "")}</h1>`,
					}}
				/>,
			)
		} else if (line.startsWith("## ")) {
			lines.push(
				<div
					className=""
					dangerouslySetInnerHTML={{
						__html: `<h2 class="text-4xl">${line.replace(/^## /, "")}</h2>`,
					}}
				/>,
			)
		} else if (line.startsWith("### ")) {
			lines.push(
				<div
					className=""
					dangerouslySetInnerHTML={{
						__html: `<h3 class="text-3xl">${line.replace(/^### /, "")}</h3>`,
					}}
				/>,
			)
		} else if (line.startsWith("#### ")) {
			lines.push(
				<div
					className=""
					dangerouslySetInnerHTML={{
						__html: `<h4 class="text-2xl">${line.replace(/^#### /, "")}</h4>`,
					}}
				/>,
			)
		} else if (line.startsWith("##### ")) {
			lines.push(
				<div
					className=""
					dangerouslySetInnerHTML={{
						__html: `<h5 class="text-xl">${line.replace(/^##### /, "")}</h5>`,
					}}
				/>,
			)
		} else if (line.startsWith("> ")) {
			lines.push(
				<blockquote
					className="border-l-4 border-gray-500 pl-2 font-light"
					dangerouslySetInnerHTML={{
						__html: `<div class=" ">${line.replace(/^> /, "")}</div>`,
					}}
				/>,
			)
		} else if (/^<[A-Z][a-zA-Zа-яА-Я";/=\-[\]{}.,'/ ]+\/>/.test(line)) {
			try {
				const attributes = line.match(/(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g)

				const componentName = line.match(/<([^\s>]+)(\s|>)+/)[1]
				const Component = (components as any)[componentName]

				const props = (attributes || []).reduce((acc, v) => {
					const pair = v.split("=")
					acc[pair[0]] = pair[1].slice(1, -1)
					return acc
				}, {} as Record<string, string>)

				lines.push(<Component {...props} />)
			} catch (e) {
				lines.push(
					<div
						className=""
						dangerouslySetInnerHTML={{
							__html: `<p class="text-red-700">Error loading component: ${e.message}</p>`,
						}}
					/>,
				)
			}
		} else if (line === "") {
			lines.push(<br />)
		} else {
			lines.push(<div dangerouslySetInnerHTML={{ __html: line }} />)
		}
	})

	return lines
}

export const RenderWindow: React.FC<{ content: string }> = ({ content }) => {
	const [renderedContent, setRenderedContent] = React.useState([])

	useEffect(() => {
		setRenderedContent(transpile(content))
	}, [content])
	return (
		<div className="p-2 w-full">
			{renderedContent.map((element, index) => (
				<span className="w-full leading-7" key={String(index)}>
					{element}
				</span>
			))}
		</div>
	)
}
