/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { TDotPath, TFromDotPath, TZags, ZAGS } from "@ordo-pink/zags"

import { type TMaokaZags } from "./maoka-zags.types"

/**
 * MaokaZAGS creates {@link https://jsr.io/@ordo-pink/zags 🔗 ZAGS} specifically for using with
 * {@link https://jsr.io/@ordo-pink/maoka 🔗 Maoka}.
 */
export const MaokaZAGS = {
	From: <$TState extends Record<string, unknown>>($: TZags<$TState>): TMaokaZags<$TState> => {
		const selection_results = new Map<TDotPath<$TState>, unknown>()
		const selection_subs = new Map<TDotPath<$TState>, string[]>()

		return {
			get zags() {
				return $
			},

			/**
			 * A Jab that subscribes to a value extracted with a selector function, and refreshes the Maoka
			 * component if the value changes. It automatically divorces the ZAGS state when the component
			 * unmounts. The value is internally cached to avoid redundant refreshes.
			 *
			 * TODO Use path selector
			 *
			 * @param selector function that reduces state to desired value.
			 */
			select_jab$:
				<K extends TDotPath<$TState>>(path: K) =>
				({ refresh, on_unmount, id }) => {
					let value: TFromDotPath<$TState, K>
					let is_initial_render = true

					if (!selection_subs.has(path)) selection_subs.set(path, [])

					const subs = selection_subs.get(path)!

					if (!subs.includes(id)) selection_subs.set(path, [...subs, id])

					const divorce = $.marry(() => {
						value = $.select(path)

						if (is_initial_render) {
							selection_results.set(path, value)
							is_initial_render = false
							return
						}

						if (!selection_results.has(path) || !deep_equals(selection_results.get(path), value)) {
							selection_results.set(path, value)
							void refresh()
						}
					})

					on_unmount(() => {
						divorce()

						let subs = selection_subs.get(path)
						if (!subs) return

						selection_subs.set(path, subs.toSpliced(subs.indexOf(id), 1))
						subs = selection_subs.get(path)

						if (!subs || subs.length <= 0) {
							selection_subs.delete(path)
							selection_results.delete(path)
						}
					})

					return () => value
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
