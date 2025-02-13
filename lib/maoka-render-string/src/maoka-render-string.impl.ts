/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type TMaokaChild } from "@ordo-pink/maoka"

import { type TMaokaRenderStringFn, type TMaokaStrElement } from "./maoka-render-string.types"

export const render: TMaokaRenderStringFn = async (root, component) => {
	const root_id = crypto.randomUUID()
	const Component = await component(create_element, root, root_id)

	root.appendChild(Component)

	return root.str()
}

export const create_element = (tag: string): TMaokaStrElement => {
	const attributes = {} as Record<string, string>
	let children = [] as TMaokaChild[]

	return {
		setAttribute: (qualified_name: string, value: string) => {
			attributes[qualified_name] = value
		},
		getAttribute: (qualified_name: string) => qualified_name,
		removeAttribute: (qualified_name: string) => {
			delete attributes[qualified_name]
		},
		appendChild: child => {
			children.push(child)
			return child
		},
		replaceChildren: (...new_children) => {
			children = new_children
		},
		get children() {
			return children
		},
		dispatchEvent: () => false,
		str: async (depth = 0) => {
			const result = "\n"
				.concat(" ".repeat(depth * 2))
				.concat("<")
				.concat(tag)
				.concat(Object.keys(attributes).length ? " " : "")
				.concat(Object.keys(attributes).reduce((acc, key) => acc.concat(`${key}="${attributes[key]}"`), ""))
				.concat(">")

			const child_strings = [] as string[]

			for (const child of children) {
				if (!child) {
					continue
				} else if (is_maoka_str_element(child)) {
					child_strings.push(await child.str(depth + 1))
				} else if (typeof child === "string") {
					child_strings.push(" ".concat(child).concat("\n"))
				} else if (typeof child === "number") {
					child_strings.push(" ".concat(String(child)).concat("\n"))
				}
			}

			return result
				.concat(child_strings.join("\n"))
				.concat(" ".repeat(depth * 2))
				.concat("</")
				.concat(tag)
				.concat(">\n")
		},
	}
}

export const is_maoka_str_element = (x: any): x is TMaokaStrElement =>
	!!x && typeof x === "object" && x.str && typeof x.str === "function"
