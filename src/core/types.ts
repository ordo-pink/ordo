export type Nullable<T> = T | null

export type Optional<T> = T | undefined

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Fn<Arguments = any, Result = void> = Arguments extends void
  ? () => Result
  : (arg: Arguments) => Result

export type UnaryFn<Arg, Result> = Fn<Arg, Result>

export type Unpack<T> = T extends Array<infer U> ? U : T

export type Thunk<T> = () => T

export type OrdoEvent<
  Scope extends string = string,
  Identifier extends string = string
> = `@${Scope}/${Identifier}`
