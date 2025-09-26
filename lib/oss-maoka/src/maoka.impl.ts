/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as Maoka from "./maoka.types"

export * from "./context/maoka-context.impl"
export * from "./dom/maoka-dom.impl"
export * from "./styled/maoka-styled.impl"

export * as context from "./context/maoka-context.impl"
export * as dom from "./dom/maoka-dom.impl"
export { default as styled } from "./styled/maoka-styled.impl"

const MAOKA_NODE_MARK = Symbol("@maoka/node")
const MAOKA_COMPONENT_MARK = Symbol("@maoka/component")

export const component_guard: Maoka.ComponentGuard = (x): x is Maoka.Component =>
	typeof x === "function" && !!x[MAOKA_COMPONENT_MARK]

export const node_guard: Maoka.NodeGuard = (x: any): x is Maoka.Node => !!x && typeof x === "object" && !!x[MAOKA_NODE_MARK]

export const create_component: Maoka.CreateComponent = (tag, callback) => args => {
	const component = async (root: Maoka.Root) => {
		const value = root.create_value(tag)
		const node: Maoka.Node = {
			id: root.create_id(),
			kindergarten: () => null,
			value,
			[MAOKA_NODE_MARK as any]: true,
			root,
		}
		const use: Maoka.Use = jab => jab({ use, node })

		node.kindergarten =
			typeof args === "function"
				? await callback({ kindergarten: args, use, node } as any)
				: await callback({ ...args, use, node } as any)

		return node
	}

	component[MAOKA_COMPONENT_MARK] = true as const

	return component
}
