/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

/** @import * as Maoka from "./maoka.types.ts" */

const MAOKA_NODE_MARK = Symbol("@maoka/node")
const MAOKA_COMPONENT_MARK = Symbol("@maoka/component")

/** @type {Maoka.ComponentGuard} */
export const component_guard = x => typeof x === "function" && !!x[MAOKA_COMPONENT_MARK]

/** @type {Maoka.NodeGuard} */
export const node_guard = x => !!x && typeof x === "object" && !!x[MAOKA_NODE_MARK]

/** @type {Maoka.Create} */
export const create = (tag, callback) => args => {
	const component = async root => {
		const value = root.create_value(tag)
		const node = {
			id: root.create_id(),
			kindergarten: () => null,
			refresh: () => void 0,
			value,
			[MAOKA_NODE_MARK]: true,
			root,
		}
		const refresh$ = root.refresh$(node)
		node.refresh$ = refresh$
		const use = jab => jab({ use, node, refresh$ })

		node.kindergarten =
			typeof args === "function"
				? await callback({ kindergarten: args, use, node, refresh$ })
				: await callback({ ...args, use, node, refresh$ })

		return node
	}

	component[MAOKA_COMPONENT_MARK] = true

	return component
}
