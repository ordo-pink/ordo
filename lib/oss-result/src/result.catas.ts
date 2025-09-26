import * as Result from "./result.types"

export const or_nothing: Result.OrNothing = () => ({ ok: x => x, err: () => void 0 })

export const expect: Result.Expect = f => ({ ok: x => x, err: x => f(x) as never })

export const unwrap: Result.Unwrap = () => ({ ok: x => x, err: x => x })

export const or_else: Result.OrElse = f => ({ ok: x => x, err: f })
