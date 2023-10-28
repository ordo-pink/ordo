// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

const TEXT_ELEMENT = "TEXT_ELEMENT"

const createTextElement = (text: string | number) => ({
	type: TEXT_ELEMENT,
	props: { nodeValue: text, children: [] },
})

export const h = (type: string, props: Record<string, any> | null, ...children: any[]) => {
	console.log(type, props, children)
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

export const Fragment = (...args: any[]) => {
	console.log("Fragment", args)
}

export const jsxDEV = (type: string, props: Record<string, any> | null, ...children: any[]) => {
	console.log(type, props, children)
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

export const render = (element: any, container: any) => {
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
