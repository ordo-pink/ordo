import { ISwitchStatic, UnaryFn, ISwitch, ThunkFn, Unpack } from "--types"

const isFunction = <T = unknown, K = T>(x: unknown): x is UnaryFn<T, K> => typeof x == "function"

export const Switch: ISwitchStatic = {
  of: (x) => swich(x),
}

const swichMatched = <TContext, TResult extends unknown[] = []>(
  x: TContext,
): ISwitch<TContext, TResult> => ({
  case: () => swichMatched(x),
  default: () => (x as ThunkFn<Unpack<TResult>>)(),
})

const swich = <TContext, TResult extends unknown[] = []>(
  x: TContext,
): ISwitch<TContext, TResult> => ({
  case: (predicate, onTrue) => {
    const isTrue = isFunction(predicate) ? predicate(x) : predicate === x

    return isTrue ? swichMatched(onTrue) : (swich(x) as any)
  },
  default: (defaultValue) => defaultValue(),
})
