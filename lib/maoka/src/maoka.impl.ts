/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Maoka } from "./maoka.types"

export namespace maoka {
	const NODE_MARK = Symbol("@maoka/node")
	const COMPONENT_MARK = Symbol("@maoka/component")

	export const guards: Maoka.Guards.Module = {
		component: (x): x is Maoka.Component => !!x && typeof x === "function" && x[COMPONENT_MARK],
		node: (x: any): x is Maoka.Node => !!x && typeof x === "object" && x[NODE_MARK],
	}

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

		return component as any
	}
}
