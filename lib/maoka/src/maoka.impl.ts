// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import type * as T from "./maoka.types"

const is_fn = (x: unknown): x is (...args: any[]) => any => typeof x === "function"
const is_string = (x: unknown): x is string => typeof x === "string"
const is_array = Array.isArray

// TODO: Refactor
// TODO: Extract helper hooks
// TODO: render_string
export const create =
	<$TElement extends T.TMaokaElement = T.TMaokaElement, $TText extends T.TMaokaText = T.TMaokaText>(
		name: string,
		callback?: T.TMaokaCallback,
	): T.TMaokaCreateComponentImplFn<$TElement, $TText> =>
	(
		create_element: (name: string) => $TElement,
		create_text: (text: string) => $TText,
		root_id: string,
	) => {
		const internal_id = crypto.randomUUID()
		const on = {
			unmount: [] as Parameters<T.TMaokaOnUnountFn>[0][],
			refresh: [] as Parameters<T.TMaokaOnRefreshFn>[0][],
		}

		// eslint-disable-next-line
		let children_fn: ReturnType<T.TMaokaCallback>

		const props: T.TMaokaProps = {
			get internal_id() {
				return internal_id
			},
			get current_element() {
				return element
			},
			get root_id() {
				return root_id
			},
			use: f => f(props),
			refresh: () => {
				// TODO: Check intersection
				for (let i = 0; i < on.refresh.length; i++) {
					on.refresh[i]()
				}

				if (!callback || !children_fn) {
					return
				}

				let children = children_fn()

				if (!is_array(children))
					children = [is_fn(children) ? children(create_element, create_text, root_id) : children]

				const nodes = children.reduce(
					(acc, child) => {
						const node = is_fn(child) ? child(create_element, create_text, root_id) : child
						return node ? acc.concat(node) : acc
					},
					[] as (SVGSVGElement | HTMLElement | string)[],
				)

				// requestAnimationFrame
				element.replaceChildren(...nodes)
			},
			on_unmount: f => void on.unmount.push(f),
			on_refresh: f => void on.refresh.push(f),
		} as T.TMaokaProps

		const element = create_element(name)
		element.onunmount = on.unmount

		if (!callback) return element

		children_fn = callback(props)
		if (!children_fn) return element

		let children = children_fn()
		if (!children) return element

		if (!is_array(children))
			children = [is_fn(children) ? children(create_element, create_text, root_id) : children]

		children.forEach(child => {
			const node = is_fn(child) ? child(create_element, create_text, root_id) : child

			if (!node) return

			element.appendChild(is_string(node) ? (create_text(node) as Text) : node)
		})

		return element
	}

export const styled = (tag: string, classes: string, children_thunk: () => T.TMaokaChildren) =>
	create(tag, ({ current_element }) => {
		current_element.setAttribute("class", classes)
		return children_thunk
	})

export const render_dom: T.TMaokaRenderDOMFn = (root, component) => {
	const root_id: string = crypto.randomUUID()

	const Component = component(
		document.createElement.bind(document),
		document.createTextNode.bind(document),
		root_id,
	)
	root.appendChild(Component)

	const unmount_element = (element: T.TMaokaElement) => {
		if (is_array(element.onunmount) && element.onunmount.length > 0)
			element.onunmount.forEach(f => f())

		element.childNodes.forEach(child => unmount_element(child as any))
	}

	const observer = new MutationObserver(records => {
		for (const record of records) {
			const removed_nodes = record.removedNodes as unknown as T.TMaokaElement[]

			for (let i = 0; i < removed_nodes.length; i++) {
				const element = removed_nodes[i]
				unmount_element(element)
			}
		}
	})

	observer.observe(root, { childList: true, subtree: true })
}
