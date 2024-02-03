// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

// deno-lint-ignore-file no-explicit-any

export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type Method<A, T extends object, K extends keyof T> = Unary<A, T[K]>

type CurryFirst<T> = T extends (x: infer U, ...rest: any) => any ? U : never
type CurryRest<T> = T extends (x: infer U) => infer V
	? V
	: T extends (x: infer U, ...rest: infer V) => infer W
	? Curry<(...args: V) => W>
	: never

// @see https://stackoverflow.com/a/69413070
export type NonNegativeInt<T extends number> = number extends T
	? never
	: `${T}` extends `-${string}` | `${string}.${string}`
	? never
	: T

// @see https://stackoverflow.com/a/70307091
export type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N
	? Acc[number]
	: Enumerate<N, [...Acc, Acc["length"]]>

export type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export type Curry<T extends (...args: any) => any> = (x: CurryFirst<T>) => CurryRest<T>

export type Identity<T> = (x: T) => T

/**
 * The notorious argument-free function.
 *
 * @example `() => "REDUX"`
 */
export type Thunk<Result> = () => Result

/**
 * Unary function accepts one argument.
 *
 * @example `(x) => x + 1`
 */
export type Unary<X, Result> = (x: X) => Result

/**
 * Binary function accepts two arguments.
 *
 * @example `(x, y) => x + y`
 */
export type Binary<X, Y, Result> = (x: X, y: Y) => Result

/**
 * Ternary function accepts three arguments.
 *
 * @example `(x, y, z) => x + y + z`
 */
export type Ternary<X, Y, Z, Result> = (x: X, y: Y, z: Z) => Result

export type _KeysOfFn = <T extends object>(o: T) => (keyof T)[]

/**
 * Transforms an array into a union type.
 *
 * @example `[string, number, string, boolean] -> string | number | boolean`
 */
export type Unpack<T> = T extends Array<infer U> ? U : T

/**
 * Validation function.
 *
 * @example `(num) => num > 3`
 */
export type ValidatorFn<Arg> = (arg: Arg) => boolean

/**
 * Disallows using characters in a provided union of characters in a provided string.
 *
 * @example ForbidCharacters<"*" | "+", "2*2"> -> never
 * @example ForbidCharacters<"*" | "+", "2+2"> -> never
 * @example ForbidCharacters<"*" | "+", "2-2"> -> "2-2"
 */
export type ForbidCharacters<
	Chars extends string,
	Str extends string,
> = Str extends `${string}${Chars}${string}` ? never : Str
