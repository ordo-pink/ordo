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

/**
 * Logger type with methods in accordance with RFC5424
 *
 * @see https://www.rfc-editor.org/rfc/rfc5424
 */
export type Logger = {
  /**
   * Severity Level 0: Emergency: system is unusable.
   *
   * Setting verbose to true will only log the message if verbose mode is
   * enabled.
   */
  panic: <T>(message: T) => void

  /**
   * Severity Level 1: Alert: action must be taken immediately.
   *
   * Setting verbose to true will only log the message if verbose mode is
   * enabled.
   */
  alert: <T>(message: T) => void

  /**
   * Severity Level 2: Critical: critical conditions.
   *
   * Setting verbose to true will only log the message if verbose mode is
   * enabled.
   */
  critical: <T>(message: T) => void

  /**
   * Severity Level 3: Error: error conditions.
   *
   * Setting verbose to true will only log the message if verbose mode is
   * enabled.
   */
  error: <T>(message: T) => void

  /**
   * Severity Level 4: Warning: warning conditions.
   *
   * Setting verbose to true will only log the message if verbose mode is
   * enabled.
   */
  warn: <T>(message: T) => void

  /**
   * Severity level 5: Notice: normal but significant condition.
   *
   * Setting verbose to true will only log the message if verbose mode is
   * enabled.
   */
  notice: <T>(message: T, verbose?: boolean) => void

  /**
   * Severity level 6: Informational: informational messages.
   *
   * Setting verbose to true will only log the message if verbose mode is
   * enabled.
   */
  info: <T>(message: T, verbose?: boolean) => void

  /**
   * Severity level 7: Debug: debug-level messages.
   *
   * Setting verbose to true will only log the message if verbose mode is
   * enabled.
   */
  debug: <T>(message: T, verbose?: boolean) => void
}
