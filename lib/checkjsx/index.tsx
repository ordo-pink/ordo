// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

const TEXT_ELEMENT = "TEXT_ELEMENT"

const createTextElement = (text: string | number) => ({
	type: TEXT_ELEMENT,
	props: { nodeValue: text, children: [] },
})

const render = (element: any, container: any) => {
	const dom =
		element.type == "TEXT_ELEMENT"
			? document.createTextNode("")
			: document.createElement(element.type)

	element.props.children.forEach(child => render(child, dom))

	const isProperty = key => key !== "children"
	Object.keys(element.props)
		.filter(isProperty)
		.forEach(name => {
			dom[name] = element.props[name]
		})

	container.appendChild(dom)
}

const h = (type: string, props: Record<string, any> | null, ...children: any[]) => {
	return {
		type,
		props: {
			...props,
			children: children.map(child =>
				typeof child === "object" ? child : createTextElement(child),
			),
		},
	}
}

const Component = () => {
	return (
		<div>
			<button onClick={console.log}>hello 1</button>
			<div>hello 2</div>
		</div>
	)
}

render(<Component />, document.getElementById("app"))
