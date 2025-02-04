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

			return () => {
				const index = handlers.indexOf(f)

				if (index >= 0) handlers.splice(index, 1)
			}
		},
		cheat: (path, f) => {
			let value: any

			const wrapped_f = (state: any, is_update: boolean) => {
				const keys = (path as string).split(".")
				const location: Record<string, any> = keys.slice(0, -1).reduce((acc, key) => acc[key], state)
				const current_value = location[keys[keys.length - 1]]

				if (value !== current_value) {
					value = current_value
					f(value, is_update)
				}
			}

			handlers.push(wrapped_f)
			wrapped_f(state, false)

			return () => {
				const index = handlers.indexOf(wrapped_f)

				if (index >= 0) handlers.splice(index, 1)
			}
		},
		divorce: f => {
			const index = handlers.indexOf(f)

			if (index >= 0) handlers.splice(index, 1)
		},
		update: (path, value_creator) => {
			const keys = (path as string).split(".")
			const state_copy = Object.assign({}, state)

			const location: Record<string, any> = keys.slice(0, -1).reduce((acc, key) => (acc as any)[key], state_copy)
			const current_value = location[keys[keys.length - 1]]
			const value = value_creator(
				Array.isArray(current_value)
					? [...current_value]
					: typeof current_value === "object" && current_value
						? Object.assign({}, current_value)
						: current_value,
			)

			if (value !== current_value) {
				location[keys[keys.length - 1]] = value
				state = Object.assign({}, state_copy)

				handlers.forEach(f => f(state, true))
			}
		},
		select: path => {
			const keys = (path as string).split(".")
			const location: Record<string, any> = keys.slice(0, -1).reduce((acc, key) => (acc as any)[key], Object.assign({}, state))

			return location[keys[keys.length - 1]]
		},
		replace: new_state => {
			if (state === new_state) return

			state = Object.assign({}, new_state)
			handlers.forEach(f => f(state, true))
		},
		update_all: f => {
			const updated_state = f(Object.assign({}, state))

			if (updated_state !== state) {
				state = Object.assign({}, updated_state)
				handlers.forEach(f => f(state, true))
			}
		},
		unwrap: () => Object.assign({}, state),
	}),
}
