/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Maoka } from "./maoka.types"

export namespace maoka_context {
	export const create: Maoka.Context.Create = <$Value>() => {
		const state = {} as Record<Maoka.Id, $Value>

		return {
			provide:
				(value: $Value): Maoka.Jab =>
				({ node }) =>
					void (state[node.root.id] = value),
			consume: ({ node }) => state[node.root.id],
		}
	}
}
