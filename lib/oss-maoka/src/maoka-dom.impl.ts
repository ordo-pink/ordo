/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Maoka, MaokaDOM } from "./maoka.types"
import { maoka } from "./maoka.impl"

export namespace maoka_dom {
	export namespace guards {
		export const is_dom_node: MaokaDOM.Guards.IsDOMNode = <$Element extends HTMLElement = HTMLElement>(
			x: any,
		): x is MaokaDOM.Node<$Element> =>
			maoka.guards.node(x) && globalThis.HTMLElement && x.value instanceof globalThis.HTMLElement
	}

	export namespace jabs {
		export const if_dom: MaokaDOM.Jabs.IfDOM =
			f =>
			({ node }) => {
				if (guards.is_dom_node(node)) return f(node as any)
			}

		export const onmount: MaokaDOM.Jabs.OnMount =
			f =>
			({ use }) =>
				use(
					if_dom(dom_node => {
						if (!dom_node.value.onmount) dom_node.value.onmount = []
						dom_node.value.onmount.push(() => f(dom_node))
					}),
				)

		export const onunmount: MaokaDOM.Jabs.OnUnmount =
			f =>
			({ use }) =>
				use(
					if_dom(dom_node => {
						if (!dom_node.value.onunmount) dom_node.value.onunmount = []
						dom_node.value.onunmount.push(() => f(dom_node))
					}),
				)

		export const refresh$: MaokaDOM.Jabs.Refresh$ = ({ use }) =>
			use(if_dom(n => n.value.dispatchEvent(new CustomEvent("refresh$", { detail: n, bubbles: true }))))
	}

	//// Render

	export const render: MaokaDOM.Render = async (root_element, component, create_id) => {
		if (!globalThis.document) throw new Error("Couldn't find `document`. Did you attempt to render to DOM outside browser?")

		const root: MaokaDOM.Root<HTMLElement> = {
			create_id,
			create_value: tag => document.createElement(tag),
			id: create_id(),
			refresh_queue: [],
		}

		const node = (await component(root)) as MaokaDOM.Node

		const request_idle_callback = globalThis.requestIdleCallback ?? setTimeout

		const render_loop = () => {
			if (root.refresh_queue.length > 0) {
				Promise.all(
					root.refresh_queue.map((node, index) => {
						root.refresh_queue.splice(index, 1)
						return internal.render_dom_children(node)
					}),
				).catch(console.error)
			}

			request_idle_callback(() => void render_loop())
		}

		request_idle_callback(() => void render_loop())

		root_element.addEventListener("refresh$", event => {
			event.stopPropagation()

			const node = (event as CustomEvent).detail as MaokaDOM.Node
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
			for (const record of records) {
				const added_nodes = record.addedNodes as unknown as (HTMLElement & {
					mounted?: boolean
					onmount?: MaokaDOM.OnMountHandler[]
					onunmount?: MaokaDOM.OnUnmountHandler[]
				})[]

				const removed_nodes = record.removedNodes as unknown as (HTMLElement & {
					onmount?: MaokaDOM.OnMountHandler[]
					onunmount?: MaokaDOM.OnUnmountHandler[]
				})[]

				for (let i = 0; i < added_nodes.length; i++) {
					const element = added_nodes[i]
					internal.mount_element(element)
				}

				for (let i = 0; i < removed_nodes.length; i++) {
					const element = removed_nodes[i]
					internal.unmount_element(element)
				}
			}
		})

		observer.observe(root_element, { childList: true, subtree: true, attributeFilter: ["onmount", "onunmount"] })

		await internal.render_dom_children(node)

		root_element.replaceChildren(node.value)
	}

	//// Internal

	/** @ignore */
	namespace internal {
		export const mount_element = (
			element: HTMLElement & {
				mounted?: boolean
				onunmount?: MaokaDOM.OnUnmountHandler[]
				onmount?: MaokaDOM.OnMountHandler[]
			},
		) => {
			if (element.mounted) return

			element.mounted = true

			if (element.onmount) {
				for (let i = 0; i < element.onmount.length; i++) {
					const maybe_handle_unmount = element.onmount[i]()

					if (maybe_handle_unmount) {
						if (!element.onunmount) element.onunmount = []
						element.onunmount.push(maybe_handle_unmount)
					}
				}
			}

			if (element.children) for (let i = 0; i < element.children.length; i++) mount_element(element.children[i] as HTMLElement)
		}

		export const unmount_element = (element: HTMLElement & { onunmount?: MaokaDOM.OnUnmountHandler[] }) => {
			if (element.onunmount) for (let i = 0; i < element.onunmount.length; i++) element.onunmount[i]()
			if (element.children)
				for (let i = 0; i < element.children.length; i++) unmount_element(element.children[i] as HTMLElement)
		}

		export const render_dom_children = async (node: Maoka.Node<HTMLElement>) => {
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

			const nodes = [] as (HTMLElement | string)[]

			for (let i = 0; i < children.length; i++) {
				const child = children[i]

				if (typeof child === "string") nodes.push(child)
				else if (typeof child === "number") nodes.push(String(child))
				else if (maoka_dom.guards.is_dom_node(child)) nodes.push(await render_dom_children(child))
				else if (maoka.guards.component(child)) nodes.push(await render_dom_children((await child(node.root)) as any))
				else if (!child) continue
				else console.error("Unsupported child", child)
			}

			if (!nodes.length) node.value.innerHTML = ""
			else node.value.replaceChildren(...nodes)

			return node.value
		}
	}
}
