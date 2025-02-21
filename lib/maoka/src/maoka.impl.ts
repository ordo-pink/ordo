/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as T from "./maoka.types.ts"

export const create: T.TMaokaCreateComponentFn = (name, callback) => {
	const result: T.TMaokaComponent = async (create_element, root_element, root_id) => {
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
			get rid() {
				return root_id
			},
			get root() {
				return root_element
			},
			use: f => f(props),
			refresh: () => {
				if (!callback || !get_children) return

				const event = new CustomEvent("refresh", {
					detail: [internal_id, element, () => get_children && get_children()],
					bubbles: true,
				})

				element.dispatchEvent(event)
			},
		} as T.TMaokaProps

		result.element = element
		result.id = internal_id
		result.rid = root_id
		result.refresh = props.refresh

		if (!callback) return element

		get_children = await callback(props)
		if (!get_children) return element

		return await render_children(create_element, root_element, root_id, get_children, element)
	}

	return result
}

export const lazy = (callback: () => Promise<{ default: T.TMaokaComponent }>): Promise<T.TMaokaComponent> =>
	callback().then(result => result.default)

export const styled =
	(tag: string, attributes: Record<string, string> = {}) =>
	(children_thunk: ReturnType<T.TMaokaCallback>): T.TMaokaComponent =>
		create(tag, ({ element: current_element }) => {
			Object.keys(attributes).forEach(key => current_element.setAttribute(key, attributes[key]))

			return children_thunk
		})

export const html = (tag: string, html: string): T.TMaokaComponent =>
	create(tag, ({ element }) => {
		if (element instanceof Element) return void (element.innerHTML = html)
		return () => html
	})

// --- Internal ---

export const render_children = async (
	create_element: T.TMaokaCreateMaokaElementFn,
	root_element: T.TMaokaElement,
	root_id: string,
	get_children: Awaited<ReturnType<T.TMaokaCallback>>,
	element: T.TMaokaElement,
) => {
	if (!get_children) return element
	if (element instanceof HTMLElement) element.innerHTML = ""
	let children = await get_children()
	if (!children) return element

	if (!is_arr(children)) children = [is_fun(children) ? await children(create_element, root_element, root_id) : children]

	const nodes: T.TMaokaChild[] = []

	for (let i = 0; i < children.length; i++) {
		const x = children[i]
		const node = is_fun(x) ? await x(create_element, root_element, root_id) : is_num(x) ? String(x) : x

		if (node) nodes.push(node)
	}

	element.replaceChildren(...nodes)

	return element
}

const is_fun = (x: unknown): x is (...args: any[]) => any => typeof x === "function"
const is_num = (x: unknown): x is number => typeof x === "number"
const is_arr = Array.isArray
