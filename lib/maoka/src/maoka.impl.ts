// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import type * as T from "./maoka.types"

const noop = () => void 0 as void
const is_undefined = (x: unknown): x is undefined | null => x == null
const is_fn = (x: unknown): x is (...args: any[]) => any => typeof x === "function"
const is_string = (x: unknown): x is string => typeof x === "string"
const is_array = Array.isArray
const for_each_key = <T extends Record<string, unknown>>(
	obj: T,
	callback: (key: keyof T) => void,
) => Object.keys(obj).forEach(key => callback(key))

const hooks = {} as Record<string, unknown>

export const init_create_component =
	<$TCustomHooks extends Record<string, unknown> = Record<string, unknown>>({
		create_element,
		create_text,
		hooks,
	}: T.TMaokaConfig<$TCustomHooks>) =>
	(name: string) =>
	(attrs_or_cb: T.TAttributes | T.TCallback<$TCustomHooks>, cb?: T.TCallback<$TCustomHooks>) =>
	() => {
		const internal_id = crypto.randomUUID()
		const on = { mount: noop, refresh: noop }

		const attrs_is_attrs = !is_fn(attrs_or_cb)

		const attributes = attrs_is_attrs ? attrs_or_cb : {}
		const callback = attrs_is_attrs ? cb : attrs_or_cb

		const use: T.THooks<$TCustomHooks> = {
			id: () => internal_id,
			current_element: () => element,
			remove: () => {
				requestAnimationFrame(() => {
					element.parentElement?.removeChild(element)
				})
			},
			refresh: () => {
				requestAnimationFrame(() => {
					const after_refresh = on.refresh()

					if (callback) {
						let children = callback(use)

						if (children) {
							if (!is_array(children)) children = [is_fn(children) ? children() : children]

							const nodes = [] as (HTMLElement | Text)[]

							children.forEach(child => {
								const node = typeof child === "function" ? child() : child
								if (is_string(node)) nodes.push(create_text(node))
								else nodes.push(node)
							})

							element.replaceChildren(...nodes)
						}
					}

					is_fn(after_refresh) && after_refresh()
				})
			},
			on_mount: f => void (on.mount = f),
			on_refresh: f => void (on.refresh = f),
		} as T.THooks<$TCustomHooks>

		if (hooks) for_each_key(hooks, key => ((use as any)[key] = hooks[key](use)))

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
				if (!is_array(children)) children = [is_fn(children) ? children() : children]

				children.forEach(child => {
					const node = is_fn(child) ? child() : child
					if (is_string(node)) element.appendChild(create_text(node))
					else element.appendChild(node)
				})
			}
		}

		on.mount()

		return element
	}
