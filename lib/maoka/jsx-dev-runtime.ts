export const h = (
	type: string | Function,
	props: Record<string, any> | null,
	...children: any[]
) => {
	type = typeof type === "function" ? type().type : type

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

export const jsxDEV = (
	type: string | Function,
	props: Record<string, any> | null,
	...children: any[]
) => {
	type = typeof type === "function" ? type().type : type

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

const TEXT_ELEMENT = "TEXT_ELEMENT"

const createTextElement = (text: string | number) => ({
	type: TEXT_ELEMENT,
	props: { nodeValue: text, children: [] },
})

export const render = (el: Element, container: any) => {
	const dom =
		el.type == "TEXT_ELEMENT"
			? document.createTextNode(el.props.nodeValue)
			: document.createElement(el.type)

	console.log(el)

	el.props.children.forEach(child => render(child, dom))

	const isProperty = key => key !== "children"

	Object.keys(el.props)
		.filter(isProperty)
		.forEach(name => {
			dom[name.toLowerCase()] = el.props[name]
		})

	container.appendChild(dom)
}

interface Element {
	type: string
	props: {
		children: Element[]
		[key: string]: any
	}
}

// export const render = (element: any, container: any) => {
// 	const dom =
// 		element.type == "TEXT_ELEMENT"
// 			? document.createTextNode("")
// 			: document.createElement(element.type)

// 	element.props.children.forEach(child => render(child, dom))

// 	const isProperty = (key: string) => key !== "children"

// 	Object.keys(element.props)
// 		.filter(isProperty)
// 		.forEach(name => {
// 			dom[name] = element.props[name]
// 		})

// 	container.appendChild(dom)
// }
