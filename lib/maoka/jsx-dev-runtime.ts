const TEXT_ELEMENT = "TEXT_ELEMENT"

const createTextElement = (text: string | number) => ({
	type: TEXT_ELEMENT,
	props: { nodeValue: text, children: [] },
})

export const h = (...args: any[]) => {
	console.log(args)
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

	const isProperty = (key: string) => key !== "children"

	Object.keys(element.props)
		.filter(isProperty)
		.forEach(name => {
			dom[name] = element.props[name]
		})

	container.appendChild(dom)
}
