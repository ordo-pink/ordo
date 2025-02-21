/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Maoka, type TMaokaComponent, type TMaokaElement, type TMaokaJab } from "@ordo-pink/maoka"
import { type TMaokaDOMElement, type TMaokaRenderDOMFn } from "./maoka-render-dom.types"

export const is_maoka_dom_element = (x: unknown): x is TMaokaDOMElement & Element => {
	try {
		return x instanceof Element
	} catch (_) {
		return false
	}
}

export const onmount_jab =
	(callback: (() => void) | (() => () => void)): TMaokaJab =>
	({ element }) =>
		is_maoka_dom_element(element) ? void (element.onmount = callback) : void 0

export const onunmount_jab =
	(callback: (() => void) | (() => () => void)): TMaokaJab =>
	({ element }) =>
		is_maoka_dom_element(element) ? void (element.onunmount = callback) : void 0

export const is_dom_jab: TMaokaJab<boolean> = ({ element }) => is_maoka_dom_element(element)

export const render: TMaokaRenderDOMFn = async (root, component) => {
	const root_id: string = crypto.randomUUID()
	const root_element = root as unknown as TMaokaElement

	const create_element = document.createElement.bind(document)
	const Component = await component(create_element, root_element, root_id)
	const refresh_queue = new Map<string, { element: TMaokaElement; get_children: () => Promise<TMaokaElement> }>()

	root.appendChild(Component as unknown as Element)

	root.addEventListener("refresh", event => {
		event.stopPropagation()

		const [id, element, get_children] = (event as any).detail as [string, TMaokaDOMElement, () => TMaokaComponent]

		const refresh_nodes = refresh_queue.keys().toArray()

		if (refresh_queue.has(id)) return

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
			get_children: () => Maoka.render_children(create_element, root_element, root_id, get_children, element),
		})
	})

	const request_idle_callback = requestIdleCallback ?? setTimeout

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

	const unmount_element = (element: TMaokaDOMElement) => {
		if (element.onunmount) element.onunmount()

		if (element.children)
			for (let i = 0; i < element.children.length; i++) {
				unmount_element(element.children[i] as TMaokaDOMElement)
			}
	}

	const mount_element = (element: TMaokaDOMElement) => {
		if (element.onmount) {
			const f = element.onmount()
			if (f && typeof f === "function") element.onunmount = f
		}

		if (element.children)
			for (let i = 0; i < element.children.length; i++) {
				mount_element(element.children[i] as TMaokaDOMElement)
			}
	}

	mount_element(Component)

	const observer = new MutationObserver(records => {
		for (const record of records) {
			const removed_nodes = record.removedNodes as unknown as TMaokaElement[]
			const mounted_nodes = record.addedNodes as unknown as TMaokaElement[]

			for (let i = 0; i < removed_nodes.length; i++) {
				const element = removed_nodes[i]
				unmount_element(element)
			}

			for (let i = 0; i < mounted_nodes.length; i++) {
				const element = mounted_nodes[i]
				mount_element(element)
			}
		}
	})

	observer.observe(root, { childList: true, subtree: true, attributeFilter: ["onmount", "onunmount"] })
}
