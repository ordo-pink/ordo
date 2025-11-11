/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

/** @import * as MaokaDom from "./maoka-dom.types.ts" */

import * as DOM from "./maoka-dom.constants.js"
import * as maoka from "../maoka.impl.js"

export * from "./jabs/maoka-jabs.impl.js"
export * as jabs from "./jabs/maoka-jabs.impl.js"

/** @type {MaokaDom.DomNodeGuard} */
export const node_guard = x => maoka.node_guard(x) && globalThis.HTMLElement && x.value instanceof globalThis.HTMLElement

/** @type {MaokaDom.DomRender} */
export const render = async (root_element, component, create_id) => {
	if (!globalThis.document) throw new Error("Couldn't find `document`. Did you attempt to render to DOM outside browser?")

	const create_value = tag => document.createElement(tag)

	/** @type {MaokaDom.DomRoot<HTMLElement>} */
	const root = {
		create_id,
		create_value,
		id: create_id(),
		refresh_queue: [],
		refresh$: node => () => node.value.dispatchEvent(new CustomEvent(DOM.REFRESH_EVENT_NAME, { detail: node, bubbles: true })),
	}
	const node = await component(root)

	const request_idle_callback = globalThis.requestIdleCallback ?? setTimeout

	const render_loop = () => {
		if (root.refresh_queue.length > 0) {
			Promise.all(
				root.refresh_queue.map((node, index) => {
					root.refresh_queue.splice(index, 1)
					return render_dom_children(node)
				}),
			)
		}

		request_idle_callback(() => void render_loop())
	}

	request_idle_callback(() => void render_loop())

	root_element.addEventListener(DOM.REFRESH_EVENT_NAME, event => {
		event.stopPropagation()

		const node = event.detail
		let skip = false

		if (root.refresh_queue.some(n => n.id === node.id)) return

		for (let i = 0; i < root.refresh_queue.length; i++) {
			const refresh_element = root.refresh_queue[i]?.value

			if (refresh_element && refresh_element instanceof Element && node.value instanceof Element) {
				if (skip) break

				if (node.value.contains?.(refresh_element)) root.refresh_queue.splice(i, 1)
				if (refresh_element.isEqualNode(node.value) || refresh_element.contains(node.value)) skip = true
			}
		}

		if (!skip) root.refresh_queue.push(node)
	})

	const observer = new MutationObserver(records => {
		for (let i = 0; i < records.length; i++) {
			const added_nodes = records[i].addedNodes
			const removed_nodes = records[i].removedNodes

			for (let i = 0; i < added_nodes.length; i++) {
				const element = added_nodes[i]
				void mount_element(element)
			}

			for (let i = 0; i < removed_nodes.length; i++) {
				const element = removed_nodes[i]
				void unmount_element(element)
			}
		}
	})

	observer.observe(root_element, { childList: true, subtree: true, attributeFilter: ["mounted", "onmount", "onunmount"] })

	await render_dom_children(node)

	root_element.replaceChildren(node.value)
}

// --- Internal ---

const mount_element = async element => {
	if (element.mounted) return

	element.mounted = true

	if (element.onmount) {
		for (let i = 0; i < element.onmount.length; i++) {
			const maybe_handle_unmount = await element.onmount[i]()

			if (maybe_handle_unmount) {
				if (!element.onunmount) element.onunmount = []
				element.onunmount.push(maybe_handle_unmount)
			}
		}
	}

	if (element.children) for (let i = 0; i < element.children.length; i++) await mount_element(element.children[i])
}

const unmount_element = async element => {
	if (element.onunmount) for (let i = 0; i < element.onunmount.length; i++) await element.onunmount[i]()
	if (element.children) for (let i = 0; i < element.children.length; i++) await unmount_element(element.children[i])
}

const render_dom_children = async node => {
	if (!node.kindergarten) {
		if (node.kindergarten === null) node.value.innerHTML = ""
		return node.value
	}

	let children = await node.kindergarten()

	if (children == null) {
		if (children === null) node.value.innerHTML = ""
		return node.value
	}

	if (!Array.isArray(children)) children = [children]

	const nodes = []

	for (let i = 0; i < children.length; i++) {
		const child = children[i]

		if (typeof child === "string") nodes.push(child)
		else if (typeof child === "number") nodes.push(String(child))
		else if (node_guard(child)) nodes.push(await render_dom_children(child))
		else if (maoka.component_guard(child)) nodes.push(await render_dom_children(await child(node.root)))
		else if (!child) continue
		else console.error("Unsupported maoka child", child)
	}

	if (!nodes.length) node.value.innerHTML = ""
	else node.value.replaceChildren(...nodes)

	return node.value
}
