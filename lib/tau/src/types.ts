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

// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

import { TResult } from "@ordo-pink/result"
import { TRrr } from "@ordo-pink/data"

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

export type TSnakeToPascal<S extends string> = S extends `${infer A}_${infer B}`
	? `${Capitalize<A>}${TSnakeToPascal<B>}`
	: Capitalize<S>

export type TDropIsPrefix<T extends string> = T extends `is_${infer U}` ? U : never

export type TValidation<TEntity extends Record<string, unknown>, TKey extends keyof TEntity> = (
	x: unknown,
) => TResult<TEntity[TKey], TRrr<"EINVAL">>

export type TValidations<TEntity extends Record<string, unknown>> = {
	[K in keyof TEntity extends string ? `is_${keyof TEntity}` : never]: TValidation<
		TEntity,
		TDropIsPrefix<K>
	>
}
