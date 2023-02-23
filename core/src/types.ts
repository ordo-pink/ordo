export type Nullable<T> = T | null

export type Optional<T> = T | undefined

/**
 * Transforms an array into a union type.
 *
 * @example `[string, number, string, boolean] -> string | number | boolean`
 */
export type Unpack<T> = T extends Array<infer U> ? U : T

/**
 * Unary function accepts one argument.
 *
 * @example `(x) => x + 1`
 */
export type UnaryFn<Arg, Result> = (arg: Arg) => Result

/**
 * Binary function accepts two arguments.
 *
 * @example `(x, y) => x + y`
 */
export type BinaryFn<Arg1, Arg2, Result> = (arg1: Arg1, arg2: Arg2) => Result

/**
 * Ternary function accepts three arguments.
 *
 * @example `(x, y, z) => x + y + z`
 */
export type TernaryFn<Arg1, Arg2, Arg3, Result> = (arg1: Arg1, arg2: Arg2, arg3: Arg3) => Result

/**
 * The notorious argument-free function.
 *
 * @example `() => "REDUX"`
 */
export type ThunkFn<Result> = () => Result

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
