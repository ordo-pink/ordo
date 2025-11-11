/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

/** @import * as Styled from "./maoka-context.types.ts" */

/** @type {Styled.Create} */
export const create = () => {
	const state = {}

	return {
		provide:
			value =>
			({ node }) =>
				void (state[node.root.id] = value),
		consume: ({ node }) => state[node.root.id],
	}
}
