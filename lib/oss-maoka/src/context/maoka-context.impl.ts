/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as Styled from "./maoka-context.types"

export const create: Styled.Create = <$Value>() => {
	const state = {} as Styled.InternalState

	return {
		provide:
			(value: $Value) =>
			({ node }) =>
				void (state[node.root.id] = value),
		consume: ({ node }) => state[node.root.id],
	}
}
