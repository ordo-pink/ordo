/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { ZAGS } from "@ordo-pink/zags"

import { type TMaokaZags } from "./maoka-zags.types"

/**
 * MaokaZAGS creates {@link https://jsr.io/@ordo-pink/zags 🔗 ZAGS} specifically for using with
 * {@link https://jsr.io/@ordo-pink/maoka 🔗 Maoka}.
 */
export const MaokaZAGS = {
	/**
	 * Create an instance of MaokaZAGS.
	 *
	 * @param initial_state state value to start with.
	 */
	Of: <$TState extends Record<string, unknown>>(initial_state: $TState): TMaokaZags<$TState> => {
		const zags = ZAGS.Of(initial_state)
		const selection_results = new Map<Parameters<TMaokaZags<$TState>["select_jab$"]>[0], unknown>()
		const selection_subs = new Map<Parameters<TMaokaZags<$TState>["select_jab$"]>[0], string[]>()

		return {
			/**
			 * Update ZAGS state with given value.
			 *
			 * @param path path to the value to be set in the state.
			 * @param value value to be assigned under given path.
			 */
			update: (path, value): void => {
				const state = zags.unwrap()
				const keys = (path as string).split(".")

				const location: Record<string, unknown> = keys.slice(0, -1).reduce((acc, key) => (acc as any)[key], state)

				if (location[keys[keys.length - 1]] !== value) {
					location[keys[keys.length - 1]] = value
					zags.update(state)
				}
			},

			/**
			 * A Jab that subscribes to a value extracted with a selector function, and refreshes the Maoka
			 * component if the value changes. It automatically divorces the ZAGS state when the component
			 * unmounts. The value is internally cached to avoid redundant refreshes.
			 *
			 * @param selector function that reduces state to desired value.
			 */
			select_jab$:
				<$TResult>(selector: (state: $TState) => $TResult) =>
				({ refresh, on_unmount, id }): (() => $TResult) => {
					let value: $TResult
					let is_initial_render = true

					if (!selection_subs.has(selector)) {
						selection_subs.set(selector, [])
					}

					const subs = selection_subs.get(selector)!

					if (!subs.includes(id)) selection_subs.set(selector, [...subs, id])

					const divorce = zags.marry(state => {
						value = selector(state)

						if (is_initial_render) {
							selection_results.set(selector, value)
							is_initial_render = false
							return
						}

						if (!selection_results.has(selector) || !deep_equals(selection_results.get(selector), value)) {
							selection_results.set(selector, value)
							void refresh()
						}
					})

					on_unmount(() => {
						divorce()

						let subs = selection_subs.get(selector)
						if (!subs) return

						selection_subs.set(selector, subs.toSpliced(subs.indexOf(id), 1))
						subs = selection_subs.get(selector)

						if (!subs || subs.length <= 0) {
							selection_subs.delete(selector)
							selection_results.delete(selector)
						}
					})

					return () => value
				},
		}
	},
}

// TODO Move outside
const deep_equals = (x: unknown, y: unknown): boolean => {
	const typeof_x = typeof x

	if (typeof_x !== typeof y) {
		return false
	}

	if (typeof_x === "object") {
		if (x === null || y === null) return x === y

		if (Array.isArray(x)) {
			if (!Array.isArray(y)) {
				return false
			}

			return x.reduce((acc, item, index) => acc && deep_equals(item, y[index]), true)
		}

		return Object.keys(x as Record<string, unknown>).reduce(
			(acc, key) => acc && deep_equals((x as Record<string, unknown>)[key], (y as Record<string, unknown>)[key]),
			true,
		)
	}

	return x === y
}
