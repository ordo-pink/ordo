/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { HTML_TAGS } from "./html-tags"
import { Maoka } from "./maoka.types"

//// DOM

export const render_dom: Maoka.DOM.Render = async (root_element, component, create_id) => {
	if (!globalThis.document) throw new Error("Couldn't find `document`. Did you attempt to render to DOM outside browser?")

	const root: Maoka.DOM.Root<HTMLElement> = {
		create_id,
		create_value: tag => document.createElement(tag),
		id: create_id(),
		refresh_queue: [],
	}
	const node = await component(root)

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

		const node = (event as CustomEvent).detail as Maoka.DOM.Node

		if (root.refresh_queue.some(n => n.id === node.id)) return

		for (let i = 0; i < root.refresh_queue.length; i++) {
			const refresh_element = root.refresh_queue[i]?.value

			if (
				refresh_element &&
				refresh_element instanceof Element &&
				node.value instanceof Element &&
				node.value.contains?.(refresh_element)
			) {
				root.refresh_queue.splice(i, 1)
				break
			}
		}

		root.refresh_queue.push(node)
	})

	const observer = new MutationObserver(records => {
		for (const record of records) {
			const added_nodes = record.addedNodes as unknown as (HTMLElement & {
				mounted?: boolean
				onmount?: Maoka.DOM.OnMountHandler[]
				onunmount?: Maoka.DOM.OnUnmountHandler[]
			})[]

			const removed_nodes = record.removedNodes as unknown as (HTMLElement & {
				onmount?: Maoka.DOM.OnMountHandler[]
				onunmount?: Maoka.DOM.OnUnmountHandler[]
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

export const dom: Maoka.DOM.Static = {
	render: render_dom,
}

//// Guards

export const is_node_guard: Maoka.Guards.IsNode = <$Value>(x: any): x is Maoka.Node<$Value> =>
	!!x && typeof x === "object" && x[internal.NODE_MARK]

export const is_component_guard: Maoka.Guards.IsComponent = (x): x is Maoka.Component =>
	!!x && typeof x === "function" && x[internal.COMPONENT_MARK]

export const is_dom_node_guard: Maoka.Guards.IsDOMNode = <$Element extends HTMLElement = HTMLElement>(
	x: any,
): x is Maoka.DOM.Node<$Element> => is_node_guard(x) && globalThis.HTMLElement && x.value instanceof globalThis.HTMLElement

export const guards: Maoka.Guards.Static = {
	component: is_component_guard,
	node: is_node_guard,
	dom_node: is_dom_node_guard,
}

//// Jabs

export const if_dom_jab: Maoka.Jabs.IfDOM = f => (_, node) => {
	if (is_dom_node_guard(node)) return f(node as any)
}

export const onmount_jab: Maoka.Jabs.OnMount = f => use =>
	use(
		if_dom_jab(dom_node => {
			if (!dom_node.value.onmount) dom_node.value.onmount = []
			dom_node.value.onmount.push(f)
		}),
	)

export const onunmount_jab: Maoka.Jabs.OnUnmount = f => use =>
	use(
		if_dom_jab(dom_node => {
			if (!dom_node.value.onunmount) dom_node.value.onunmount = []
			dom_node.value.onunmount.push(f)
		}),
	)

export const refresh_jab$: Maoka.Jabs.Refresh$ = use =>
	use(if_dom_jab(n => n.value.dispatchEvent(new CustomEvent("refresh$", { detail: n, bubbles: true }))))

export const create_context: Maoka.Context.Create = <$Value>() => {
	const state = {} as Record<Maoka.Id, $Value>

	return {
		provide:
			(value: $Value): Maoka.Jab =>
			(_, node) =>
				void (state[node.root.id] = value),
		consume: (_, node) => state[node.root.id],
	}
}

export const jabs: Maoka.Jabs.Static = {
	if_dom: if_dom_jab,
	onmount: onmount_jab,
	onunmount: onunmount_jab,
	refresh$: refresh_jab$,
}

//// Module

export const create_component: Maoka.CreateComponent = (tag: string, callback?) => {
	if (!callback) return callback => internal.create(tag, callback as any)
	return internal.create(tag, callback) as any
}

const styled: Maoka.Styled = HTML_TAGS.reduce(
	(acc, tag) => ({
		...acc,
		[tag]: (classes: string, f?: Maoka.Fn<unknown>) => {
			if (!f)
				return (f: Maoka.Fn<unknown>) =>
					create_component(tag, (use, node) => {
						use(if_dom_jab(n => n.value.setAttribute("class", classes)))
						return f(use, node)
					})

			return create_component(tag, (use, node) => {
				use(if_dom_jab(n => n.value.setAttribute("class", classes)))
				return f(use, node)
			})
		},
	}),
	{} as Maoka.Styled,
)

export const maoka: Maoka.Module = {
	context: create_context,
	create: create_component,
	dom,
	guards,
	jabs,
	styled,
}

//// Internal

/** @ignore */
namespace internal {
	export const NODE_MARK = Symbol.for("@maoka/node")
	export const COMPONENT_MARK = Symbol.for("@maoka/component")
	export const DOM_NODE_MARK = Symbol.for("@maoka/dom-node")

	export const mount_element = (
		element: HTMLElement & {
			mounted?: boolean
			onunmount?: Maoka.DOM.OnUnmountHandler[]
			onmount?: Maoka.DOM.OnMountHandler[]
		},
	) => {
		if (element.onmount)
			for (let i = 0; i < element.onmount.length; i++) {
				const f = element.onmount[i]()

				if (f && !element.mounted) {
					if (!element.onunmount) element.onunmount = []
					element.onunmount.push(f)
				}
			}
		if (element.children) for (let i = 0; i < element.children.length; i++) mount_element(element.children[i] as HTMLElement)
		if (!element.mounted) element.mounted = true
	}

	export const unmount_element = (element: HTMLElement & { onunmount?: Maoka.DOM.OnUnmountHandler[] }) => {
		if (element.onunmount) for (let i = 0; i < element.onunmount.length; i++) element.onunmount[i]()
		if (element.children) for (let i = 0; i < element.children.length; i++) unmount_element(element.children[i] as HTMLElement)
	}

	export const create = <$Value>(tag: string, callback: Maoka.Fn<$Value>): Maoka.Component => {
		const component = async (root: Maoka.Root<$Value>) => {
			const value = root.create_value(tag)
			const node: Maoka.Node<$Value> = {
				id: root.create_id(),
				kindergarten: () => null,
				value,
				[internal.NODE_MARK as any]: true,
				root,
			}
			const use: Maoka.Use = jab => jab(use, node)

			node.kindergarten = await callback(use, node)

			return node
		}

		component[COMPONENT_MARK] = true as const

		return component as any
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
			else if (is_node_guard(child)) nodes.push(await render_dom_children(child))
			else if (is_component_guard(child)) nodes.push(await render_dom_children(await child(node.root)))
			else if (!child) continue
			else console.error("Unsupported child", child)
		}

		node.value.replaceChildren(...nodes)

		return node.value
	}
}
