/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UnaryFn } from "@ordo-pink/common-types"
import type { ISwitchStatic, ISwitch, LazySwitch } from "./types"

// Public ---------------------------------------------------------------------

export const Switch: ISwitchStatic = {
  of: (x) => _switch(x),
  empty: () => _switch(undefined),
}

export const lazySwitch: LazySwitch = (callback) => (x) => callback(Switch.of(x))

// Internal -------------------------------------------------------------------

// Types ----------------------------------------------------------------------

type _SwitchCase = <TContext, TResult extends unknown[]>(
  x: TContext,
) => ISwitch<TContext, TResult>["case"]

type _SwitchDefault = <TContext, TResult extends unknown[]>(
  x: TContext,
) => ISwitch<TContext, TResult>["default"]

type _Switch = <TContext, TResult extends unknown[] = []>(x: TContext) => ISwitch<TContext, TResult>

// Helpers --------------------------------------------------------------------

const isFunction = <T = unknown, K = T>(x: unknown): x is UnaryFn<T, K> => typeof x == "function"

// Impl  ----------------------------------------------------------------------

// Unmatched switch -----------------------------------------------------------

const _switchCase: _SwitchCase = (x) => (predicate, onTrue) => {
  const isTrue = isFunction(predicate) ? predicate(x) : predicate === x

  return isTrue ? _switchMatched(onTrue) : (_switch(x) as any)
}

const _switchDefault: _SwitchDefault = () => (defaultValue) => defaultValue()

const _switch: _Switch = (x) => ({
  case: _switchCase(x),
  default: _switchDefault(x),
})

// Matched switch -------------------------------------------------------------

const _switchMatchedCase: _SwitchCase = (x) => () => _switchMatched(x)

const _switchMatchedDefault: _SwitchDefault = (x) => x as any

const _switchMatched: _Switch = (x) => ({
  case: _switchMatchedCase(x),
  default: _switchMatchedDefault(x),
})
