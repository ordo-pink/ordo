// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { BehaviorSubject } from "rxjs"

const TEXT_ELEMENT = "TEXT_ELEMENT"

const createTextElement = (text: string | number) => ({
	type: TEXT_ELEMENT,
	props: { nodeValue: text, children: [] },
})

const h = (type: string | Function, props: Record<string, any> | null, ...children: any[]) => {
	if (typeof type === "function") return type()

	const result = {
		type,
		props: {
			...props,
			children: children.map(child =>
				typeof child === "object" ? child : createTextElement(child),
			),
		},
	}

	console.log(result)

	return result
}

interface Element {
	type: string
	props: {
		children: Element[]
		[key: string]: any
	}
}

const render = (el: Element, container: any) => {
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

/** @jsx h */
const Component = () => {
	const value$ = new BehaviorSubject(0)

	return (
		<div>
			<div>Counter: {value$.value}</div>
			<button onClick={() => value$.next(value$.value - 1)}>-</button>
			<button onClick={() => value$.next(value$.value + 1)}>+</button>
		</div>
	)
}

render(<Component />, document.getElementById("app"))
