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
		node: <$Value>(x: any): x is Maoka.Node<$Value> => !!x && typeof x === "object" && x[NODE_MARK],
	}

	export const create: Maoka.CreateComponent = (tag: string, callback?) => {
		if (!callback) return callback => internal.create(tag, callback as any)
		return internal.create(tag, callback) as any
	}

	namespace internal {
		export const create = <$Value>(tag: string, callback: Maoka.Fn<$Value>): Maoka.Component => {
			const component = async (root: Maoka.Root<$Value>) => {
				const value = root.create_value(tag)
				const node: Maoka.Node<$Value> = {
					id: root.create_id(),
					kindergarten: () => null,
					value,
					[NODE_MARK as any]: true,
					root,
				}
				const use: Maoka.Use = jab => jab(use, node)

				node.kindergarten = await callback(use, node)

				return node
			}

			component[COMPONENT_MARK] = true as const

			return component as any
		}
	}
}
