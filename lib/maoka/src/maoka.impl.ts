// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import type * as T from "./maoka.types"

const is_undefined = (x: unknown): x is undefined | null => x == null
const is_fn = (x: unknown): x is (...args: any[]) => any => typeof x === "function"
const is_string = (x: unknown): x is string => typeof x === "string"
const is_array = Array.isArray
const for_each_key = <T extends Record<string, unknown>>(
	obj: T,
	callback: (key: keyof T) => void,
) => Object.keys(obj).forEach(key => callback(key))

type TMaokaRenderParams<$TCustomHooks extends Record<string, unknown> = Record<string, unknown>> = {
	root: HTMLElement
	component: (
		create_element: (name: string) => HTMLElement,
		create_text: (text: string) => Text,
		custom_hooks: T.TInitHook<$TCustomHooks>,
	) => HTMLElement
	hooks: T.TInitHook<$TCustomHooks>
}

// TODO: empty()
// TODO: Refactor
// TODO: A simpler way to pass children
// TODO: render_string
export const create =
	<$TCustomHooks extends Record<string, unknown> = Record<string, unknown>>(name: string) =>
	(attrs_or_cb: T.TAttributes | T.TCallback<$TCustomHooks>, cb?: T.TCallback<$TCustomHooks>) =>
	(
		create_element: (name: string) => HTMLElement,
		create_text: (text: string) => Text,
		custom_hooks: T.TInitHook<$TCustomHooks>,
	) => {
		const internal_id = crypto.randomUUID()
		const on = {
			mount: [] as ((() => void) | (() => () => void))[],
			refresh: [] as (() => void)[],
			unmount: [] as (() => void)[],
		}

		const attrs_is_attrs = !is_fn(attrs_or_cb)

		const attributes = attrs_is_attrs ? attrs_or_cb : {}
		const callback = attrs_is_attrs ? cb : attrs_or_cb

		const use: T.THooks<$TCustomHooks> = {
			get_internal_id: () => internal_id,
			get_current_element: () => element,
			set_attribute: (key, value) => {
				const old_value = element.getAttribute(key)

				if (value === old_value) return

				element.setAttribute(key, value)
			},
			set_class: (...cls) => element.setAttribute("class", cls.join(" ")),
			add_class: (...cls) => {
				cls.forEach(c => element.classList.add(...c.split(" ")))
			},
			remove_class: (...cls) => {
				cls.forEach(c => element.classList.remove(...c.split(" ")))
			},
			replace_class: (p, n) => {
				element.classList.replace(p, n)
			},
			set_style: style => {
				for_each_key(style, key => {
					;(element.style as any)[key] = style[key]!
				})
			},
			set_listener: (event, handler) => {
				;(element as any)[event] = handler
			},
			set_inner_html: html => {
				element.innerHTML = html
			},
			remove: () => {
				requestAnimationFrame(() => {
					element.parentElement?.removeChild(element)
				})
			},
			refresh: () => {
				requestAnimationFrame(() => {
					const after_refresh = on.refresh.map(f => f())

					if (callback) {
						let children = callback(use)

						if (children) {
							if (!is_array(children))
								children = [
									is_fn(children) ? children(create_element, create_text, custom_hooks) : children,
								]

							const nodes = [] as (HTMLElement | Text)[]

							children.forEach(child => {
								const node =
									typeof child === "function"
										? child(create_element, create_text, custom_hooks)
										: child
								if (is_string(node)) nodes.push(create_text(node))
								else if (node) nodes.push(node)
							})

							element.replaceChildren(...nodes)
						}
					}

					is_fn(after_refresh) && after_refresh()
				})
			},
			on_mount: f => void on.mount.push(f),
			on_refresh: f => void on.refresh.push(f),
		} as T.THooks<$TCustomHooks>

		if (custom_hooks)
			for_each_key(
				custom_hooks,
				(key: keyof typeof custom_hooks) => ((use as any)[key] = custom_hooks[key](use)),
			)

		const element = create_element(name)

		for_each_key(attributes, attribute => {
			if (!attribute || !is_string(attribute) || is_undefined(attributes[attribute])) return

			if (attribute.startsWith("on")) {
				// TODO: Validate listeners
				;(element as any)[attribute] = attributes[attribute]
			} else if (attribute === "unsafe_inner_html") {
				element.innerHTML = attributes[attribute] as any
			} else {
				element.setAttribute(attribute, String(attributes[attribute]))
			}
		})

		if (callback) {
			let children = callback(use)

			if (children) {
				if (!is_array(children))
					children = [
						is_fn(children) ? children(create_element, create_text, custom_hooks) : children,
					]

				children.forEach(child => {
					const node = is_fn(child) ? child(create_element, create_text, custom_hooks) : child
					if (is_string(node)) element.appendChild(create_text(node))
					else if (node) element.appendChild(node)
				})
			}
		}

		const mounted = on.mount.map(f => f())

		if (is_fn(mounted)) on.unmount.push(mounted)

		// TODO: Move outside
		const observer = new MutationObserver(records => {
			records.forEach(record => {
				if (Array.from(record.removedNodes).includes(element)) {
					on.unmount.forEach(f => f())
				}
			})
		})

		observer.observe(document, { childList: true, subtree: true })

		return element
	}

export const render_dom = <
	$TCustomHooks extends Record<string, unknown> = Record<string, unknown>,
>({
	component,
	hooks,
	root,
}: TMaokaRenderParams<$TCustomHooks>) => {
	const Component = component(
		document.createElement.bind(document),
		document.createTextNode.bind(document),
		hooks,
	)

	root.appendChild(Component)
}
