/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { deep_equals } from "@ordo-pink/deep-equals"

import { Zags } from "./zags.types.ts"

/** @see {@link Zags.Module} */
export const create_zags: Zags.Module = (state, partners = []) => ({
	cheat: (path, f) => {
		let value: any

		const wrapped_f = (state: any, is_update: boolean) => {
			const keys = (path as string).split(".")
			const location: Record<string, any> = keys.slice(0, -1).reduce((acc, key) => acc[key], state)

			if (!location) return

			const current_value = location[keys[keys.length - 1]]

			if (!is_update || !deep_equals(current_value, value)) {
				value = current_value
				f(value, is_update)
			}
		}

		partners.push(wrapped_f)
		wrapped_f(state, false)

		return () => {
			const index = partners.indexOf(wrapped_f)

			if (index >= 0) partners.splice(index, 1)
		}
	},
	divorce: f => {
		const index = partners.indexOf(f)

		if (index >= 0) partners.splice(index, 1)
	},
	marry: f => {
		partners.push(f)
		f(state, false)

		return () => {
			const index = partners.indexOf(f)

			if (index >= 0) partners.splice(index, 1)
		}
	},
	select: path => {
		const keys = (path as string).split(".")
		const location: Record<string, any> = keys.slice(0, -1).reduce((acc, key) => (acc as any)[key], state)

		if (!location) return

		return location[keys[keys.length - 1]]
	},
	replace: f => {
		const state_copy = { ...state }
		const updated_state = f(state_copy)

		if (!deep_equals(updated_state, state)) {
			state = updated_state
			partners.forEach(f => f(state, true))
		}
	},
	each: r => {
		const sorted_keys = Object.keys(r).sort((a, b) => (a.split(".").length > b.split(".").length ? 1 : -1))

		let should_let_partners_know = false
		const state_copy = { ...state }

		for (let i = 0; i < sorted_keys.length; i++) {
			const keys = sorted_keys[i].split(".")

			const location: Record<string, any> = keys.slice(0, -1).reduce((acc, key) => (acc as any)[key], state_copy)
			const current_value = location[keys[keys.length - 1]]
			const value = (r as Record<string, any>)[sorted_keys[i]](current_value)

			if (!deep_equals(value, current_value)) {
				if (!should_let_partners_know) should_let_partners_know = true

				location[keys[keys.length - 1]] = value
				state = state_copy
			}
		}

		if (should_let_partners_know) partners.forEach(f => f(state, true))
	},
	unwrap: () => state,
	update: (path, value_creator) => {
		const keys = (path as string).split(".")
		const state_copy = { ...state }

		const location: Record<string, any> = keys.slice(0, -1).reduce((acc, key) => (acc as any)[key], state_copy)
		const current_value = location[keys[keys.length - 1]]
		const value = value_creator(current_value)

		if (!deep_equals(value, current_value)) {
			location[keys[keys.length - 1]] = value
			state = state_copy

			partners.forEach(f => f(state, true))
		}
	},
})
