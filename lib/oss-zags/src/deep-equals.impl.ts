/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { DeepEquals } from "./deep-equals.types.ts"

export const deep_equals: DeepEquals = (x, y) => {
	if (typeof x !== typeof y) return false

	if (is_arr(x)) return is_arr(y) && x.length === y.length && x.reduce(arr_value_deep_equals(y), true)
	if (is_fn(x)) {
		if (!is_fn(y)) return false

		return x.toString() === y.toString()
	}

	if (is_obj(x)) {
		if (!is_obj(y)) return false

		const keys_of_x = keys(x)
		const is_same_keys_length = keys_of_x.length === keys(y).length

		return is_same_keys_length && keys_of_x.reduce(obj_value_deep_equals(x, y), true)
	}

	return x === y
}

const is_arr = Array.isArray
const is_obj = (x: unknown): x is Record<string, unknown> => !!x && typeof x === "object"
const is_fn = (x: unknown): x is (...args: any[]) => any => !!x && typeof x === "function"
const keys = Object.keys
const arr_value_deep_equals =
	(y: any[]) =>
	(acc: boolean, item: any, index: number): boolean =>
		acc && deep_equals(item, y[index])
const obj_value_deep_equals =
	(x: Record<string, unknown>, y: Record<string, unknown>) =>
	(acc: boolean, key: string): boolean =>
		acc && deep_equals(x[key], y[key])
