/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as Maoka from "./maoka.types.ts"

const NODE_MARK = Symbol("@maoka/node")
const COMPONENT_MARK = Symbol("@maoka/component")

export const component_guard: Maoka.ComponentGuard = (x): x is Maoka.Component => typeof x === "function" && !!x[COMPONENT_MARK]

export const node_guard: Maoka.NodeGuard = (x: any): x is Maoka.Node => !!x && typeof x === "object" && !!x[NODE_MARK]

export const create: Maoka.CreateComponent = (tag, callback) => args => {
	const component = async (root: Maoka.Root) => {
		const value = root.create_value(tag)
		const node: Maoka.Node = {
			id: root.create_id(),
			kindergarten: () => null,
			value,
			[NODE_MARK as any]: true,
			root,
		}
		const use: Maoka.Use = jab => jab({ use, node })

		node.kindergarten =
			typeof args === "function"
				? await callback({ kindergarten: args, use, node } as any)
				: await callback({ ...args, use, node } as any)

		return node
	}

	component[COMPONENT_MARK] = true as const

	return component
}
