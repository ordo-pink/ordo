// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import type * as Types from "./types"

export const UUIDv4_RX = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

export const N = () => null

export const T = () => true
export const F = () => false

export type UUIDv4 = `${string}-${string}-${string}-${string}-${string}`

export type AllKeysRequired<T extends Record<string, any>> = { [K in keyof T]: NonNullable<T[K]> }

export const is_object = (x: unknown): x is Record<string, unknown> =>
	x != null && typeof x === "object" && !Array.isArray(x)

export const is_fn = <T = unknown, K = T>(x: unknown): x is (x: T) => K => typeof x == "function"

export const is_true = (x: unknown): x is true => x === true
export const is_false = (x: unknown): x is false => x === false
export const is_bool = (x: unknown): x is boolean => is_true(x) || is_false(x)
export const is_array = Array.isArray
export const is_date = (x: unknown): x is Date => !!x && x instanceof Date
export const is_string = (x: unknown): x is string => !!x && typeof x === "string"
export const is_non_empty_string = (x: unknown): x is string => is_string(x) && x.trim() !== ""
export const is_number = (x: unknown): x is number => typeof x === "number"
export const is_negative_number = (x: unknown): x is number => is_number(x) && x < 0
export const is_0 = (x: unknown): x is 0 => x === 0
export const is_positive_number = (x: unknown): x is number => is_number(x) && x > 0
export const is_non_negative_number = (x: unknown): x is number => is_0(x) || is_positive_number(x)
export const is_finite = (x: unknown): x is number => Number.isFinite(x)
export const is_int = (x: unknown): x is number => Number.isInteger(x)
export const is_nan = (x: unknown): x is number => Number.isNaN(x)
export const is_infinite = (x: unknown): x is number => is_number(x) && !is_finite(x)
export const is_finite_non_negative_int = (x: unknown): x is number =>
	is_non_negative_number(x) && is_finite(x) && is_int(x)
export const is_uuid = (x: unknown): x is UUIDv4 => is_string(x) && UUIDv4_RX.test(x)

export const keys_of: Types._KeysOfFn = o => {
	return Object.keys(o) as any
}

export const noop = () => {}
export const extend =
	<T extends Record<string, unknown>, N extends Record<string, unknown>>(f: (obj: T) => N) =>
	(obj: T) => ({ ...obj, ...f(obj) })

export const call_once = <T extends any[], R>(fn: (...args: T) => R) => {
	let wasCalled = false

	return (...args: T): R => {
		if (wasCalled) return void 0 as unknown as R

		const result = fn(...args)

		wasCalled = true

		return result
	}
}

export const get_percentage = (total: number, current: number): number =>
	Math.trunc((current / total) * 100)

export const omit =
	<T extends Record<string, unknown>, K extends (keyof T)[]>(...keys: K) =>
	(obj: T): Omit<T, Types.Unpack<K>> =>
		keys_of(obj).reduce(
			(acc, key) => (keys.includes(key) ? acc : { ...acc, [key]: obj[key] }),
			{} as Omit<T, Types.Unpack<K>>,
		)

export const contra =
	<_TArg1, __TArg2, ___TResult>(f: (arg1: _TArg1) => (arg2: __TArg2) => ___TResult) =>
	(arg2: __TArg2) =>
	(arg1: _TArg1): ___TResult =>
		f(arg1)(arg2)

export const check_all = <_TParam>(validator: (x: _TParam) => boolean, items: _TParam[]) =>
	items.reduce((acc, item) => acc && validator(item), true)

export const negate =
	<_TParam, __TResult>(f: (x: _TParam) => __TResult) =>
	(x: _TParam) =>
		!f(x)

export const concat = <T>(xs: T[], ys: T[]) => Array.from(new Set([...xs, ...ys]))

export const alpha_sort =
	(direction: "ASC" | "DESC" = "ASC") =>
	(a: string, b: string) =>
		direction === "ASC" ? a.localeCompare(b) : b.localeCompare(a)

export const override =
	<
		_Object extends Record<string, unknown> = Record<string, unknown>,
		__Increment extends Partial<_Object> = Partial<_Object>,
	>(
		increment: __Increment,
	) =>
	(obj: _Object): _Object => ({ ...obj, increment })

export const first_matched =
	<T>(f: (x: T) => boolean) =>
	(xs: T[]) =>
		xs.find(i => f(i))

type TProp = <$Key extends PropertyKey>(
	prop: $Key,
) => <$Record extends { [_Property in $Key]: unknown }>(obj: $Record) => $Record[$Key]
export const prop: TProp = key => obj => obj[key]

export const thunk =
	<$T>(value: $T) =>
	() =>
		value

export const gt = (min: number) => (val: number) => val > min
export const lt = (max: number) => (val: number) => val < max
export const eq = (target: number) => (value: number) => target === value
