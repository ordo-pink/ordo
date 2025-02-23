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
	let request_idle_callback

	try {
		request_idle_callback = requestIdleCallback
	} catch (_) {
		request_idle_callback = setTimeout
	}

	const render_loop = () =>
		refresh_queue.size
			? Promise.all(
					refresh_queue.entries().map(([key, data]) => {
						refresh_queue.delete(key)
						return data.get_children()
					}),
				).then(() => request_idle_callback(() => void render_loop()))
			: request_idle_callback(() => void render_loop())

	request_idle_callback(() => void render_loop())

	const id = create_id()

	return {
		create_id,
		create_element,
		get element() {
			return element
		},
		get id() {
			return id
		},
	}
}

const refresh_queue = new Map<string, { element: T.TMaokaElement; get_children: () => Promise<T.TMaokaElement> }>()

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
					new CustomEvent("refresh", { detail: [id, element, () => get_children && get_children()], bubbles: true }),
				),
		} satisfies T.TMaokaProps

		result.element = element
		result.id = id
		result.refresh = props.refresh

		if (!callback) return element

		get_children = await callback(props)
		if (!get_children) return element

		root.element.addEventListener("refresh", event => {
			event.stopPropagation()

			const [id, element, get_children] = (event as any).detail as [string, T.TMaokaElement, () => T.TMaokaComponent]

			const refresh_nodes = refresh_queue.keys().toArray()

			if (refresh_queue.has(id)) return

			try {
				for (let i = 0; i < refresh_nodes.length; i++) {
					const refresh_element = refresh_queue.get(refresh_nodes[i])?.element

					if (
						refresh_element &&
						refresh_element instanceof Element &&
						element instanceof Element &&
						element.contains?.(refresh_element)
					) {
						refresh_queue.delete(refresh_nodes[i])
						break
					}
				}

				refresh_queue.set(id, {
					element,
					get_children: () => render_children(root, get_children, element),
				})
			} catch (_) {}
		})

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
	try {
		if (element instanceof HTMLElement) element.innerHTML = ""
	} catch (_) {}
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
