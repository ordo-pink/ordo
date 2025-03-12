/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Maoka, type TMaokaElement, type TMaokaJab } from "@ordo-pink/maoka"

import { type TMaokaDOMElement, type TMaokaRenderDOMFn } from "./maoka-render-dom.types"

export const is_maoka_dom_element = (x: unknown): x is TMaokaDOMElement & HTMLElement => {
	try {
		return x instanceof HTMLElement
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

export const render: TMaokaRenderDOMFn = async (root_element, component, create_id) => {
	const create_element = document.createElement.bind(document)
	const root = Maoka.create_root(root_element, create_id, create_element)
	const Component = await component(root)

	let request_idle_callback

	try {
		request_idle_callback = requestIdleCallback
		if (!request_idle_callback) throw ""
	} catch (_) {
		request_idle_callback = setTimeout
	}

	const render_loop = () =>
		root.refresh_queue.size
			? Promise.all(
					root.refresh_queue.entries().map(([key, data]) => {
						root.refresh_queue.delete(key)
						return data.render()
					}),
				).then(() => request_idle_callback(() => void render_loop()))
			: request_idle_callback(() => void render_loop())

	request_idle_callback(() => void render_loop())

	root.element.addEventListener("refresh", event => {
		event.stopPropagation()

		const [id, element, render] = (event as any).detail as [string, TMaokaElement, () => Promise<TMaokaElement>]

		const refresh_nodes = Array.from(root.refresh_queue.keys())

		if (root.refresh_queue.has(id)) return

		for (let i = 0; i < refresh_nodes.length; i++) {
			const refresh_element = root.refresh_queue.get(refresh_nodes[i])?.element

			if (
				refresh_element &&
				refresh_element instanceof Element &&
				element instanceof Element &&
				element.contains?.(refresh_element)
			) {
				root.refresh_queue.delete(refresh_nodes[i])
				break
			}
		}

		root.refresh_queue.set(id, {
			element,
			render: render,
		})
	})

	if (!is_maoka_dom_element(Component)) {
		throw new TypeError("Could not create a DOM element from provided component")
	}

	root.element.appendChild(Component)

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

	observer.observe(root.element, { childList: true, subtree: true, attributeFilter: ["onmount", "onunmount"] })
}
