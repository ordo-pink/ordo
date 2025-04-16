/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Sweech } from "./sweech.types.ts"

/**
 * A light-weight, well-typed, health-checked, and dependency-free alternative to JavaScript switch statement.
 * @module
 */

// --- Public ---

/**
 * Helper object that contains a pointing interface to put value
 * into Switch.
 */
export const sweech: Sweech.Static = {
	/**
	 * A pointing interface to put the value into Switch.
	 *
	 * @example `Switch.of(myVariableWithIDontKnowWhichThingInside)`
	 */
	match: x => _swich(x),

	/**
	 * Create an empty switch that compares provided values against `true`.
	 */
	of_true: () => _swich(true),

	/**
	 * Create an empty switch that compares provided values against `false`.
	 */
	of_false: () => _swich(false),
}

// --- Internal ---

const _switch_matched = <$Context, $Result extends unknown[] = []>(x: $Context): Sweech.Instance<$Context, $Result> => ({
	case: () => _switch_matched(x),
	default: () => (x as any)(),
})

const _swich = <$Context, $Result extends unknown[] = []>(x: $Context): Sweech.Instance<$Context, $Result> => ({
	case: (predicate, on_true) => {
		const isTrue = is_fn(predicate) ? predicate(x) : Array.isArray(predicate) ? predicate.includes(x) : predicate === x

		return isTrue ? _switch_matched(() => on_true(x)) : (_swich(x) as any)
	},
	default: f => f(x),
})

const is_fn = <T = unknown, K = T>(x: unknown): x is (x: T) => K => typeof x == "function"
