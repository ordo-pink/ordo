/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type TDotPath, type TZags, ZAGS } from "@ordo-pink/zags"

import { type TMaokaZags } from "./maoka-zags.types"

/**
 * MaokaZAGS creates {@link https://jsr.io/@ordo-pink/zags 🔗 ZAGS} specifically for using with
 * {@link https://jsr.io/@ordo-pink/maoka 🔗 Maoka}.
 */
export const MaokaZAGS = {
	From: <$TState extends Record<string, unknown>>($: TZags<$TState>): TMaokaZags<$TState> => {
		const selection_results = {} as Record<string, Record<any, any>>

		return {
			get zags() {
				return $
			},

			/**
			 * A Jab that subscribes to a value extracted with a selector function, and refreshes the Maoka
			 * component if the value changes. It automatically divorces the ZAGS state when the component
			 * unmounts. The value is internally cached to avoid redundant refreshes.
			 *
			 * @param path path to desired value.
			 */
			select_jab$:
				<K extends TDotPath<$TState>>(path: K) =>
				({ refresh, on_unmount, id }) => {
					let is_initial_render = true

					const divorce = $.marry(() => {
						const value = $.select(path)

						if (!selection_results[id]) selection_results[id] = {}

						if (is_initial_render) {
							is_initial_render = false
							selection_results[id][path as any] = value

							return
						}

						if (!deep_equals(selection_results[id][path], value)) {
							selection_results[id][path as any] = value
							void refresh()
						}
					})

					on_unmount(() => {
						divorce()
						delete selection_results[id]
					})

					return () => selection_results[id][path]!
				},
		}
	},
	/**
	 * Create an instance of MaokaZAGS.
	 *
	 * @param initial_state state value to start with.
	 */
	Of: <$TState extends Record<string, unknown>>(initial_state: $TState): TMaokaZags<$TState> => {
		const zags = ZAGS.Of(initial_state)

		return MaokaZAGS.From(zags)
	},
}

// TODO Move outside
const deep_equals = (x: unknown, y: unknown): boolean => {
	const typeof_x = typeof x

	if (typeof_x !== typeof y) return false

	if (typeof_x === "object") {
		if (x === null || y === null) return x === y

		if (Array.isArray(x))
			return (
				Array.isArray(y) && x.length === y.length && x.reduce((acc, item, index) => acc && deep_equals(item, y[index]), true)
			)

		const keys_of_x = Object.keys(x as Record<string, unknown>)

		return (
			keys_of_x.length === Object.keys(y as Record<string, unknown>).length &&
			keys_of_x.reduce(
				(acc, key) => acc && deep_equals((x as Record<string, unknown>)[key], (y as Record<string, unknown>)[key]),
				true,
			)
		)
	}

	return x === y
}
