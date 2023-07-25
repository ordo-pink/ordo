// SPDX-FileCopyrightText: Copyright 2023, Sergei Orlov and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

// deno-lint-ignore-file no-explicit-any

export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type Identity<T> = (x: T) => T

export type Method<A, T extends object, K extends keyof T> = Unary<A, T[K]>

type CurryFirst<T> = T extends (x: infer U, ...rest: any) => any ? U : never
type CurryRest<T> = T extends (x: infer U) => infer V
	? V
	: T extends (x: infer U, ...rest: infer V) => infer W
	? Curry<(...args: V) => W>
	: never

export type Curry<T extends (...args: any) => any> = (x: CurryFirst<T>) => CurryRest<T>

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
export type _TitleizeFn = <T extends string>(s: T) => Capitalize<T>

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
 * Turns given kebab-case or snake_case string type to a PascalCase string
 * type.
 *
 * @example `PascalCase<"foo-bar"> -> "FooBar"`
 * @example `PascalCase<"foo_bar"> -> "FooBar"`
 *
 * @thanks Roberto Tatasciore
 */
export type PascalCase<S extends string> = S extends `${infer Head}-${infer Tail}`
	? `${Capitalize<Head>}${PascalCase<Tail>}`
	: S extends `${infer Head}_${infer Tail}`
	? `${Capitalize<Head>}${PascalCase<Tail>}`
	: Capitalize<S>

/**
 * Turns given PascalCase, kebab-case, or snake_keys string type to a camelCase
 * string type.
 *
 * @example `CamelCase<"FooBar"> -> "fooBar"`
 * @example `CamelCase<"foo-bar"> -> "fooBar"`
 * @example `CamelCase<"foo_bar"> -> "fooBar"`
 *
 * @thanks Roberto Tatasciore
 */
export type CamelCase<S extends string> = Uncapitalize<PascalCase<S>>

/**
 * Turns an object type with PascalCase, kebab-case, or snake_case keys to an
 * object type with camelCase keys.
 *
 * @example `CamelCasedKeys<{ my_key: 1 }> -> { myKey: 1 }`
 * @example `CamelCasedKeys<{ MyKey: 1 }> -> { myKey: 1 }`
 * @example `CamelCasedKeys<{ "my-key": 1 }> -> { myKey: 1 }`
 *
 * @thanks Roberto Tatasciore
 */
export type CamelCasedKeys<T> = { [P in keyof T as CamelCase<P & string>]: T[P] }

/**
 * Turns an object type with PascalCase, kebab-case, or snake_case keys to an
 * object type with camelCase keys. Deep as Tartaros.
 *
 * @example `CamelCasedKeysDeep<{ my_key: { nested_key: 1 } }> -> { myKey: { nestedKey: 1 } }`
 * @example `CamelCasedKeysDeep<{ MyKey: { NestedKey: 1 } }> -> { myKey: { nestedKey: 1 } }`
 * @example `CamelCasedKeysDeep<{ "my-key": { "nested-key": 1 } }> -> { myKey: { nestedKey: 1 } }`
 *
 * @thanks Roberto Tatasciore
 */
export type CamelCasedKeysDeep<T> = {
	[P in keyof T as CamelCase<P & string>]: T[P] extends object ? CamelCasedKeys<T[P]> : T[P]
}

/**
 * Disallows using characters in a provided union of characters in a provided string.
 *
 * @example ForbidCharacters<"*" | "+", "2*2"> -> never
 * @example ForbidCharacters<"*" | "+", "2+2"> -> never
 * @example ForbidCharacters<"*" | "+", "2-2"> -> "2-2"
 */
export type ForbidCharacters<
	Chars extends string,
	Str extends string
> = Str extends `${string}${Chars}${string}` ? never : Str
