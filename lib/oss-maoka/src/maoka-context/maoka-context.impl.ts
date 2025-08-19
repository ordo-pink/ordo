/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as Context from "./maoka-context.types.ts"

export const create: Context.Create = <$Value>() => {
	const state = {} as Context.InternalState

	return {
		provide:
			(value: $Value) =>
			({ node }) =>
				void (state[node.root.id] = value),
		consume: ({ node }) => state[node.root.id],
	}
}
