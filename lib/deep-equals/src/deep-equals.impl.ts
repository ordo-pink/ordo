/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { DeepEquals } from "./deep-equals.types.ts"

/**
 * Checks deep equality of two provided elements. Recursively checks equality for objects and arrays.
 *
 * @param x first item to compare
 * @param y second item to compare
 * @returns boolean
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

// --- Internal ---

const internal = {
	is_arr: Array.isArray,
	is_obj: (x: unknown): x is Record<string, unknown> => !!x && typeof x === "object",
	keys: Object.keys,
	arr_value_deep_equals:
		(y: any[]) =>
		(acc: boolean, item: any, index: number): boolean =>
			acc && deep_equals(item, y[index]),
	obj_value_deep_equals:
		(x: Record<string, unknown>, y: Record<string, unknown>) =>
		(acc: boolean, key: string): boolean =>
			acc && deep_equals(x[key], y[key]),
}
