/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type TZagsStatic } from "./zags.types.ts"

/**
 * {@link TZagsStatic}
 */
export const ZAGS: TZagsStatic = {
	Of: (state, handlers = []) => ({
		marry: f => {
			handlers.push(f)
			f(state, false)
		},
		divorce: f => void handlers.splice(handlers.indexOf(f), 1),
		update: v => {
			state = { ...state, ...v }
			handlers.forEach(f => f(state, true))
		},
		unwrap: () => structuredClone(state),
	}),
}
