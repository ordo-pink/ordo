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
	) =>
	(
		create_element: (name: string) => $TElement,
		create_text: (text: string) => $TText,
		root_id: string,
	) => {
		const internal_id = crypto.randomUUID()
		const on = {
			mount: [] as Parameters<T.TMaokaOnMountFn>[0][],
			refresh: [] as Parameters<T.TMaokaOnRefreshFn>[0][],
		}

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
				const after_refresh = on.refresh.map(f => f())

				if (callback) {
					const children_fn = callback(props)
					if (!children_fn) return

					let children = children_fn()

					if (!is_array(children)) {
						children = [is_fn(children) ? children(create_element, create_text, root_id) : children]
					}

					const nodes = children.reduce(
						(acc, child) => {
							const node = is_fn(child) ? child(create_element, create_text, root_id) : child
							return node ? acc.concat(node) : acc
						},
						[] as (SVGSVGElement | HTMLElement | string)[],
					)

					// requestAnimationFrame
					element.replaceChildren(...nodes)
				}

				void after_refresh.map(f => is_fn(f) && f())
			},
			on_mount: f => void on.mount.push(f),
			on_refresh: f => void on.refresh.push(f),
		} as T.TMaokaProps

		const element = create_element(name)

		if (callback) {
			let children = callback(props)

			if (children) {
				if (!is_array(children))
					children = [is_fn(children) ? children(create_element, create_text, root_id) : children]

				requestAnimationFrame(() => {
					;(children as T.TChild[]).forEach(child => {
						const node = is_fn(child) ? child(create_element, create_text, root_id) : child

						if (!node) return

						element.appendChild(is_string(node) ? (create_text(node) as Text) : node)
					})
				})
			}
		}

		const on_unmount = on.mount.map(f => f()).filter(f => is_fn(f)) as (() => void)[]

		if (on_unmount.length) {
			element.onunmount = on_unmount
		}

		return element
	}

export const render_dom: T.TMaokaRenderDOMFn = (root, component) => {
	const root_id: string = crypto.randomUUID()

	const Component = component(
		document.createElement.bind(document),
		document.createTextNode.bind(document),
		root_id,
	)

	const observer = new MutationObserver(records => {
		for (const record of records) {
			const removed_nodes = record.removedNodes as unknown as T.TMaokaElement[]

			for (const element of removed_nodes) {
				if (is_array(element.onunmount)) element.onunmount.forEach(f => f())
			}
		}
	})

	root.appendChild(Component)
	observer.observe(root, { childList: true, subtree: true })
}
