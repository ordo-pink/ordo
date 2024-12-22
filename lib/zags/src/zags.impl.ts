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

			return () => void handlers.splice(handlers.indexOf(f), 1)
		},
		divorce: f => void handlers.splice(handlers.indexOf(f), 1),
		update: (path, value_creator) => {
			const prev_state = ZAGS.Of(state, handlers).unwrap()
			const keys = (path as string).split(".")

			const location: Record<string, any> = keys.slice(0, -1).reduce((acc, key) => (acc as any)[key], prev_state)
			const current_value = location[keys[keys.length - 1]]
			const value = value_creator(current_value)

			if (current_value !== value) {
				location[keys[keys.length - 1]] = value
				state = { ...prev_state }
			}

			handlers.forEach(f => f(prev_state, true))
		},
		select: path => {
			const current_state = ZAGS.Of(state, handlers).unwrap()

			const keys = (path as string).split(".")
			const location: Record<string, any> = keys.slice(0, -1).reduce((acc, key) => (acc as any)[key], current_state)

			return location[keys[keys.length - 1]]
		},
		replace: new_state => {
			state = { ...new_state }
			handlers.forEach(f => f(state, true))
		},
		// TODO Deep cloning
		unwrap: () => ({ ...state }),
	}),
}
