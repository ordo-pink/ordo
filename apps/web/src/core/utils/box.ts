import { UnaryFn, ThunkFn } from "@ordo-pink/common-types"
import { tap } from "ramda"

const unsafeGet = Symbol("EventBoxUnsafeGet")

export interface IBoxStatic {
  of: <T>(x: T) => IBox<T>
}

export interface IBox<T> {
  [unsafeGet]: () => T
  equals: <TOther>(other: IBox<T | TOther>) => boolean
  map: <NewT>(f: UnaryFn<T, NewT> | ThunkFn<NewT>) => IBox<NewT>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tap: (f: UnaryFn<T, any> | ThunkFn<any>) => IBox<T>
  fold: <NewT>(f: UnaryFn<T, NewT> | ThunkFn<NewT>) => NewT
}

const box = <T>(x: T): IBox<T> => ({
  [unsafeGet]: () => x,
  equals: (other) => other[unsafeGet]() === x,
  map: (f) => box(f(x)),
  tap: (f) => box(tap(f, x)),
  fold: (f) => f(x),
})

export const Box: IBoxStatic = {
  of: (x) => box(x),
}
