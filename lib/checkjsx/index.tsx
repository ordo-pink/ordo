// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { BehaviorSubject } from "rxjs"

const TEXT_ELEMENT = "TEXT_ELEMENT"

// bun run.ts
// bun build index.tsx --outfile index.js --watch

const createTextElement = (text: string | number) => ({
	type: TEXT_ELEMENT,
	props: { nodeValue: text, children: [] },
})

const h = (type: string | Function, props: Record<string, any> | null, ...children: any[]) => {
	if (typeof type === "function") return type(props)

	const result = {
		type,
		props: {
			...props,
			children: children.map(child =>
				typeof child === "object" ? child : createTextElement(child),
			),
		},
	}

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

	el.props.children.forEach(child => render(child, dom))

	const isProperty = key => key !== "children"

	Object.keys(el.props)
		.filter(isProperty)
		.forEach(name => {
			dom[name.toLowerCase()] = el.props[name]
		})

	container.appendChild(dom)
}

type P = { initialValue: number }
const Component = ({ initialValue }: P) => {
	const value$ = new BehaviorSubject(initialValue)

	return (
		<div>
			<div>Counter: {value$.value}</div>
			<button onClick={() => value$.next(value$.value - 1)}>-</button>
			<button onClick={() => value$.next(value$.value + 1)}>+</button>
		</div>
	)
}

render(<Component initialValue={2} />, document.getElementById("app"))
