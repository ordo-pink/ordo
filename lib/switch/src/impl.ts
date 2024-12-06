/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 *
 */

import type * as Types from "./types"
import { is_fn } from "@ordo-pink/tau"

// --- Public ---

export const Switch: Types.TSwitchStatic = {
	of: x => swich(x),
	Match: x => swich(x),
	OfTrue: () => swich(true),
	OfFalse: () => swich(false),
}

export const match = <T>(e: T): Types.TSwitch<T, []> => Switch.of(e)

// --- Internal ---

const switch_matched = <$TContext, $TResult extends unknown[] = []>(x: $TContext): Types.TSwitch<$TContext, $TResult> => ({
	case: () => switch_matched(x),
	default: () => (x as any)(),
	_: () => (x as any)(),
})

const swich = <$TContext, $TResult extends unknown[] = []>(x: $TContext): Types.TSwitch<$TContext, $TResult> => ({
	case: (predicate, on_true) => {
		const isTrue = is_fn(predicate) ? predicate(x) : Array.isArray(predicate) ? predicate.includes(x) : predicate === x

		return isTrue ? switch_matched(() => on_true(x)) : (swich(x) as any)
	},
	default: default_value => default_value(x),
	_: default_value => default_value(x),
})
