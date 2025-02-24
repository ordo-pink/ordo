/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as T from "./maoka.types.ts"

export const create_root = <$TElement = T.TMaokaElement>(
	element: $TElement,
	create_id: T.TCreateIDFn,
	create_element: T.TMaokaCreateMaokaElementFn,
): T.TMaokaRootElement<$TElement> => {
	const id = create_id()

	return {
		create_id,
		create_element,
		refresh_queue: new Map(),
		get element() {
			return element
		},
		get id() {
			return id
		},
	}
}

export const create: T.TMaokaCreateComponentFn = (name, callback) => {
	const result: T.TMaokaComponent = async root => {
		const id = root.create_id()
		const element = root.create_element(name)

		// eslint-disable-next-line
		let get_children: Awaited<ReturnType<T.TMaokaCallback>>

		const props: T.TMaokaProps = {
			get id() {
				return id
			},
			get element() {
				return element
			},
			get root() {
				return root
			},
			use: f => f(props),
			refresh: () =>
				element.dispatchEvent(
					new CustomEvent("refresh", {
						detail: [id, element, () => render_children(root, get_children, element)],
						bubbles: true,
					}),
				),
		} satisfies T.TMaokaProps

		result.element = element
		result.id = id
		result.refresh = props.refresh

		if (!callback) return element

		get_children = await callback(props)
		if (!get_children) return element

		return await render_children(root, get_children, element)
	}

	return result
}

export const lazy = (callback: () => Promise<{ default: T.TMaokaComponent }>): Promise<T.TMaokaComponent> =>
	callback().then(result => result.default)

const render_children = async (
	root: T.TMaokaRootElement,
	get_children: Awaited<ReturnType<T.TMaokaCallback>>,
	element: T.TMaokaElement,
) => {
	if (!get_children) return element

	let children = await get_children()
	if (!children) return element

	if (!is_arr(children)) children = [is_fun(children) ? await children(root) : children]

	const nodes: T.TMaokaChild[] = []

	for (let i = 0; i < children.length; i++) {
		const x = children[i]
		const node = is_fun(x) ? await x(root) : is_num(x) ? String(x) : x

		if (node) nodes.push(node)
	}

	element.replaceChildren(...(nodes as any[]))

	return element
}

const is_fun = (x: unknown): x is (...args: any[]) => any => typeof x === "function"
const is_num = (x: unknown): x is number => typeof x === "number"
const is_arr = Array.isArray
