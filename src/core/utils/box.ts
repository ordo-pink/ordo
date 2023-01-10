import { tap } from "ramda"

import type { ThunkFn, UnaryFn } from "$core/types"

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

const eventBox = <T>(x: T): IBox<T> => ({
  [unsafeGet]: () => x,
  equals: (other) => other[unsafeGet]() === x,
  map: (f) => eventBox(f(x)),
  tap: (f) => eventBox(tap(f, x)),
  fold: (f) => f(x),
})

export const EventBox: IBoxStatic = {
  of: (x) => eventBox(x),
}
