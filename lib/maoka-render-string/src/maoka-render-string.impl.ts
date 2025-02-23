/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Maoka, type TMaokaChild } from "@ordo-pink/maoka"

import { type TMaokaRenderStringFn, type TMaokaStringElement } from "./maoka-render-string.types"

export const render: TMaokaRenderStringFn = async (component, create_id) => {
	const root = Maoka.create_root(create_element("div"), create_id, create_element)
	const Component = await component(root)

	root.element.appendChild(Component as any)

	return Promise.all((root.element.children as any).map((child: TMaokaStringElement) => child.str())).then(strs =>
		strs.join("\n"),
	)
}

export const create_element = (tag: string): TMaokaStringElement => {
	const attributes = {} as Record<string, string>
	let children = [] as TMaokaChild[]

	return {
		setAttribute: (qualified_name: string, value: string) => {
			attributes[qualified_name] = value
		},
		addEventListener: () => void 0,
		getAttribute: (qualified_name: string) => qualified_name,
		appendChild: child => {
			children.push(child as any)
			return child
		},
		replaceChildren: (...new_children) => {
			children = new_children as any
		},
		get children() {
			return children as any
		},
		dispatchEvent: () => false,
		str: async () => {
			const result = "<"
				.concat(tag)
				.concat(Object.keys(attributes).length ? " " : "")
				.concat(Object.keys(attributes).reduce((acc, key) => acc.concat(`${key}="${attributes[key]}" `), ""))
				.concat(">")

			const child_strings = [] as string[]

			let need_to_push_closing_tag_to_next_line = false

			for (const child of children) {
				if (!child) {
					continue
				} else if (is_maoka_str_element(child)) {
					need_to_push_closing_tag_to_next_line = true
					child_strings.push("\n" + (await child.str()))
				} else if (typeof child === "string") {
					child_strings.push(child)
				} else if (typeof child === "number") {
					child_strings.push(String(child))
				}
			}

			return result
				.concat(child_strings.join(""))
				.concat(need_to_push_closing_tag_to_next_line ? "\n" : "")
				.concat("</")
				.concat(tag)
				.concat(">")
		},
	}
}

export const is_maoka_str_element = (x: any): x is TMaokaStringElement =>
	!!x && typeof x === "object" && x.str && typeof x.str === "function"
