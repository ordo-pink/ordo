// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type * as T from "./types"
import { isFunction } from "@ordo-pink/tau"

// --- Public ---

export const Switch: T.TSwitchStatic = {
	of: x => swich(x),
	empty: () => swich(true),
	negate: () => swich(false),
}

// --- Internal ---

const swichMatched = <TContext, TResult extends unknown[] = []>(
	x: TContext,
): T.TSwitch<TContext, TResult> => ({
	case: () => swichMatched(x),
	default: () => (x as any)(),
})

const swich = <TContext, TResult extends unknown[] = []>(
	x: TContext,
): T.TSwitch<TContext, TResult> => ({
	case: (predicate, onTrue) => {
		const isTrue = isFunction(predicate) ? predicate(x) : predicate === x

		return isTrue ? swichMatched(onTrue) : (swich(x) as any)
	},
	default: defaultValue => defaultValue(),
})
