/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as Sweech from "./sweech.types.ts"

export const match: Sweech.Match = x => _swich(x)

// --- Internal ---

/**
 * A pointing interface to put the value into sweech that got matched.
 *
 * @example `sweech.match(myVariableWithIDontKnowWhichThingInside)`
 */
const _switch_matched = <const $X>(x: $X): Sweech.Instance<$X> => ({
	/**
	 * Define cases like you would normally do with a switch statement, or use
	 * predicate functions to validate the value held inside sweech.
	 *
	 * @example `sweech.match(1).case(1, () => "one!").case(2, () => "Numbers, mate, remember numbers!")`
	 * @example `sweech.match(num).case((n) => n % 2 === 0, () => "even").case((n) => n % 2 === -1, () => "this is odd!")`
	 */
	case: () => _switch_matched(x),

	/**
	 * Folds the sweech and returns a value that was defined in the matched
	 * case onTrue thunk. If none of the case matched, the thunk provided as
	 * `.default` argument will be called instead.
	 *
	 * @example `sweech.match(myBoolean).case(true, () => "oh, thanks!").default(() => "You WHAT?")`
	 */
	default: () => (x as any)(),
})

/**
 * A pointing interface to put the value into sweech that did not match yet.
 *
 * @example `sweech.match(myVariableWithIDontKnowWhichThingInside)`
 */
const _swich = <const $X>(x: $X): Sweech.Instance<$X> => ({
	/**
	 * Define cases like you would normally do with a switch statement, or use
	 * predicate functions to validate the value held inside sweech.
	 *
	 * @example `sweech.match(1).case(1, () => "one!").case(2, () => "Numbers, mate, remember numbers!")`
	 * @example `sweech.match(num).case((n) => n % 2 === 0, () => "even").case((n) => n % 2 === -1, () => "this is odd!")`
	 */
	case: (predicate, on_true) => {
		const isTrue = is_fn(predicate) ? predicate(x) : Array.isArray(predicate) ? predicate.includes(x) : predicate === x

		return isTrue ? _switch_matched(() => on_true(x)) : (_swich(x) as any)
	},

	/**
	 * Folds the sweech and returns a value that was defined in the matched
	 * case onTrue thunk. If none of the case matched, the thunk provided as
	 * `.default` argument will be called instead.
	 *
	 * @example `sweech.match(myBoolean).case(true, () => "oh, thanks!").default(() => "You WHAT?")`
	 */
	default: f => f(x),
})

/**
 * Function guard.
 */
const is_fn = <T = unknown, K = T>(x: unknown): x is (x: T) => K => typeof x == "function"
