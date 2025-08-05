/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { curry } from "@ordo-pink/oss-curry"

import * as Fns from "./fns.types"

export const t: Fns.T = () => true
export const f: Fns.F = () => false
export const n: Fns.N = () => null
export const u: Fns.U = () => {}
export const v: Fns.V = u
export const eq: Fns.Eq = curry((target, val) => target === val)
export const gt: Fns.Gt = curry((min, val) => val > min)
export const lt: Fns.Lt = curry((max, val) => val < max)
export const gte: Fns.Gte = curry((min, val) => eq(min, val) || gt(min, val))
export const lte: Fns.Lte = curry((max, val) => eq(max, val) || lt(max, val))
export const keys_of: Fns.KeysOf = o => Object.keys(o) as any
export const fuzzy_check: Fns.Fuzz = curry((source, target, ratio) => {
	const clean_source = source.trim().toLowerCase()
	const clean_target = target.trim().toLowerCase()
	let hits = 0

	if (!clean_target || clean_source.indexOf(clean_target) > -1) return true

	for (let i = 0; i < clean_target.length; i++) clean_source.indexOf(clean_target[i]) > -1 ? hits++ : hits--

	return hits / source.length >= ratio
})

export const is_non_empty_string = (x: unknown): x is string => is_string(x) && x.trim() !== ""

export const is_0 = eq(0)
export const is_number = (x: unknown): x is number => typeof x === "number"
export const is_finite = (x: unknown): x is number => Number.isFinite(x)

export const is_positive_number = (x: unknown): x is number => is_number(x) && x > 0
export const is_negative_number = (x: unknown): x is number => is_number(x) && x >= 0
export const is_non_negative_number = (x: unknown): x is number => is_number(x) && (is_0(x) || is_positive_number(x))

export const is_float = (x: unknown): x is number => is_number(x) && is_finite(x) && x % 1 !== 0
export const is_positive_float = (x: any): x is number => is_positive_number(x) && is_float(x)
export const is_negative_float = (x: any): x is number => is_negative_number(x) && is_float(x)
export const is_non_negative_float = (x: unknown): x is number => is_float(x) && (is_0(x) || is_positive_number(x))

export const is_integer = (x: unknown): x is number => Number.isInteger(x)
export const is_positive_integer = (x: any): x is number => is_positive_number(x) && is_integer(x)
export const is_negative_integer = (x: any): x is number => is_negative_number(x) && is_integer(x)
export const is_non_negative_integer = (x: unknown): x is number => is_integer(x) && (is_0(x) || is_positive_number(x))

export const is_undefined = (x: any): x is undefined => typeof x === "undefined"
export const is_null = (x: unknown): x is null => typeof x === "object" && !x
export const is_string = (x: unknown): x is string => typeof x === "string"
export const is_array = Array.isArray
export const is_fn = (x: unknown): x is (...args: any[]) => any => typeof x === "function"
export const is_object = (x: unknown): x is Record<string, unknown> => x != null && typeof x === "object" && !is_array(x)

export const pipe = <$Arg, $Result>(f: (arg: $Arg) => $Result, ...fs: ((arg: any) => any)[]): Fns.Pipe<$Arg, $Result> => {
	const pub_f: any = (arg: any) => [f, ...fs].reduce((r, f) => f(r), arg)
	const _pipe = (new_f: any) => pipe(f, ...fs, new_f)

	pub_f.pipe = _pipe as any

	return pub_f
}

export const contra =
	<$A, $B, $Result>(f: (a: $A) => (b: $B) => $Result) =>
	(b: $B) =>
	(a: $A) =>
		f(a)(b)

export const prop: Fns.Prop = key => obj => obj[key]

export const replace: Fns.Replace = index => (value, arr) => arr.with(index, value) as any
