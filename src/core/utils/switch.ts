import type { Unpack } from "$core/types"

type UnaryFn<T, R> = (x: T) => R

export const isFunction = <T = unknown, K = T>(x: unknown): x is UnaryFn<T, K> =>
  typeof x == "function"

export interface ISwitchStatic {
  of: <TResult extends unknown[] = [], TContext = unknown>(
    x: TContext,
  ) => ISwitch<TContext, TResult>
}

export interface ISwitch<TContext, TResult extends unknown[]> {
  case: <TNewResult>(
    predicate: TContext | UnaryFn<TContext, boolean>,
    onTrue: TNewResult,
  ) => ISwitch<TContext, [Unpack<TResult>, TNewResult]>
  default: <TDefaultResult>(defaultValue: TDefaultResult) => Unpack<TResult> | TDefaultResult
}

export const Switch: ISwitchStatic = {
  of: (x) => swich(x),
}

const swichMatched = <TContext, TResult extends unknown[] = []>(
  x: TContext,
): ISwitch<TContext, TResult> => ({
  case: () => swichMatched(x),
  default: () => x as unknown as Unpack<TResult>,
})

const swich = <TContext, TResult extends unknown[] = []>(
  x: TContext,
): ISwitch<TContext, TResult> => ({
  case: <TNewResult>(predicate: TContext | UnaryFn<TContext, boolean>, onTrue: TNewResult) => {
    const isTrue = isFunction(predicate) ? predicate(x) : predicate === x

    return (isTrue ? swichMatched(onTrue) : swich(x)) as ISwitch<
      TContext,
      [Unpack<TResult>, TNewResult]
    >
  },
  default: <TDefaultResult>(defaultValue: TDefaultResult) =>
    defaultValue as Unpack<TResult> | TDefaultResult,
})
