/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { DeepEquals } from "./deep-equals.types.ts"

/**
 * @see {@link DeepEquals.Module}
 */
export const deep_equals: DeepEquals.Module = (x, y) => {
	if (typeof x !== typeof y) return false

	if (internal.is_arr(x))
		return internal.is_arr(y) && x.length === y.length && x.reduce(internal.arr_value_deep_equals(y), true)

	if (internal.is_obj(x)) {
		if (!internal.is_obj(y)) return false

		const keys_of_x = internal.keys(x)
		const is_same_keys_length = keys_of_x.length === internal.keys(y).length

		return is_same_keys_length && keys_of_x.reduce(internal.obj_value_deep_equals(x, y), true)
	}

	return x === y
}

namespace internal {
	export const is_arr = Array.isArray
	export const is_obj = (x: unknown): x is Record<string, unknown> => !!x && typeof x === "object"
	export const keys = Object.keys
	export const arr_value_deep_equals =
		(y: any[]) =>
		(acc: boolean, item: any, index: number): boolean =>
			acc && deep_equals(item, y[index])
	export const obj_value_deep_equals =
		(x: Record<string, unknown>, y: Record<string, unknown>) =>
		(acc: boolean, key: string): boolean =>
			acc && deep_equals(x[key], y[key])
}
