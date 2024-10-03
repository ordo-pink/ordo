// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import type * as T from "./maoka.types"

export const create: T.TMaokaCreateComponentFn =
	(name, callback) => async (create_element, root_element, root_id) => {
		const internal_id = crypto.randomUUID()
		const element = create_element(name)

		// eslint-disable-next-line
		let get_children: Awaited<ReturnType<T.TMaokaCallback>>

		const props: T.TMaokaProps = {
			get id() {
				return internal_id
			},
			get element() {
				return element
			},
			get root_id() {
				return root_id
			},
			get root_element() {
				return root_element
			},
			use: f => f(props),
			refresh: async () => {
				if (!callback || !get_children) return

				await render_children(create_element, root_element, root_id, get_children, element)
			},
			on_unmount: f => {
				if (!element.onunmount) element.onunmount = []
				element.onunmount.push(f)
			},
		} as T.TMaokaProps

		if (!callback) return element

		get_children = await callback(props)
		if (!get_children) return element

		return render_children(create_element, root_element, root_id, get_children, element)
	}

export const lazy = (callback: () => Promise<{ default: T.TMaokaComponent }>) =>
	callback().then(result => result.default)

export const pure =
	(tag: string, attributes: Record<string, string>) =>
	(children_thunk: ReturnType<T.TMaokaCallback>) =>
		create(tag, ({ element: current_element }) => {
			Object.keys(attributes).forEach(key => current_element.setAttribute(key, attributes[key]))

			return children_thunk
		})

export const render_dom: T.TMaokaRenderDOMFn = async (root, component) => {
	const root_id: string = crypto.randomUUID()

	const Component = component(
		document.createElement.bind(document),
		root as unknown as T.TMaokaElement,
		root_id,
	)

	root.appendChild((await Component) as HTMLElement)

	const unmount_element = (element: T.TMaokaElement) => {
		if (is_arr(element.onunmount) && element.onunmount.length > 0)
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

	observer.observe(root as HTMLElement, { childList: true, subtree: true })
}

// --- Internal ---

const render_children = async (
	create_element: T.TMaokaCreateMaokaElementFn,
	root_element: T.TMaokaElement,
	root_id: string,
	get_children: Awaited<ReturnType<T.TMaokaCallback>>,
	element: T.TMaokaElement,
) => {
	if (!get_children) return element
	let children = await get_children()
	if (!children) return element

	if (!is_arr(children))
		children = [is_fun(children) ? await children(create_element, root_element, root_id) : children]

	const nodes: T.TMaokaChild[] = []

	for (let i = 0; i < children.length; i++) {
		const x = children[i]
		const node = is_fun(x)
			? await x(create_element, root_element, root_id)
			: is_num(x)
				? String(x)
				: x

		if (node) nodes.push(node)
	}

	element.replaceChildren(...nodes)

	return element
}

const is_fun = (x: unknown): x is (...args: any[]) => any => typeof x === "function"
const is_num = (x: unknown): x is number => typeof x === "number"
const is_arr = Array.isArray
