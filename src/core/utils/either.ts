import { tap } from "ramda"

import type { ThunkFn, Nullable, UnaryFn } from "$core/types"

const unsafeGet = Symbol("EitherUnsafeGet")

export interface IEitherStatic {
  readonly isLeft: false
  readonly isRight: false
  try: <TRight, TLeft extends Error>(thunk: ThunkFn<TRight>) => IEither<TRight, TLeft>
  fromNullable: <TRight>(x: Nullable<TRight>) => IEither<TRight, null>
  fromBoolean: (x: boolean) => IEither<true, false>
  right: <TRight, TLeft = unknown>(x: TRight) => IEither<TRight, TLeft>
  left: <TLeft, TRight = unknown>(x: TLeft) => IEither<TRight, TLeft>
  of: <TRight, TLeft = unknown>(x: TRight) => IEither<TRight, TLeft>
}

export interface IEither<TRight, TLeft = unknown> {
  readonly isLeft: boolean
  readonly isRight: boolean
  [unsafeGet]: () => TLeft | TRight
  equals: <TOtherContext>(other: IEither<TRight | TLeft | TOtherContext>) => boolean
  swap: () => IEither<TLeft, TRight>
  map: <TNewRight>(
    onRight: UnaryFn<TRight, TNewRight> | ThunkFn<TNewRight>,
  ) => IEither<TNewRight, TLeft>
  tap: (onRight: UnaryFn<TRight, any> | ThunkFn<any>) => IEither<TRight, TLeft>
  bimap: <TNewRight, TNewLeft = TNewRight>(
    onLeft: UnaryFn<TLeft, TNewLeft> | ThunkFn<TNewLeft>,
    onRight: UnaryFn<TRight, TNewRight> | ThunkFn<TNewRight>,
  ) => IEither<TNewRight, TNewLeft>
  bitap: (
    onLeft: UnaryFn<TLeft, any> | ThunkFn<any>,
    onRight: UnaryFn<TRight, any> | ThunkFn<any>,
  ) => IEither<TRight, TLeft>
  leftMap: <TNewLeft>(
    onLeft: UnaryFn<TLeft, TNewLeft> | ThunkFn<TNewLeft>,
  ) => IEither<TRight, TNewLeft>
  leftTap: (onLeft: UnaryFn<TLeft, any> | ThunkFn<any>) => IEither<TRight, TLeft>
  chain: <TNewRight, TNewLeft>(
    onRight: UnaryFn<TRight, IEither<TNewRight, TNewLeft>> | ThunkFn<IEither<TNewRight, TNewLeft>>,
  ) => IEither<TNewRight, TLeft>
  ap: <TNewRight, TNewLeft = TLeft>(
    other: IEither<UnaryFn<TRight, TNewRight>, UnaryFn<TRight, TNewLeft>>,
  ) => IEither<TNewRight, TLeft>
  getOrElse: <TNewLeft>(onLeft: UnaryFn<TLeft, TNewLeft> | ThunkFn<TNewLeft>) => TRight | TNewLeft
  fold: <TNewRight, TNewLeft = TNewRight>(
    onLeft: UnaryFn<TLeft, TNewLeft> | ThunkFn<TNewLeft>,
    onRight: UnaryFn<TRight, TNewRight> | ThunkFn<TNewRight>,
  ) => TNewLeft | TNewRight
}

export const left = <TLeft, TRight = TLeft>(x: TLeft): IEither<TRight, TLeft> => ({
  isLeft: true,
  isRight: false,
  [unsafeGet]: () => x,
  equals: (other) => other.isLeft && other[unsafeGet]() === x,
  swap: () => right(x),
  map: () => left(x),
  tap: () => left(x),
  leftMap: (onLeft) => left(onLeft(x)),
  leftTap: (onLeft) => left(tap(onLeft, x)),
  bimap: (onLeft) => left(onLeft(x)),
  bitap: (onLeft) => left(tap(onLeft, x)),
  chain: () => left(x),
  ap: () => left(x),
  getOrElse: (onLeft) => onLeft(x),
  fold: (onLeft) => onLeft(x),
})

export const right = <TRight, TLeft = TRight>(x: TRight): IEither<TRight, TLeft> => ({
  isLeft: false,
  isRight: true,
  [unsafeGet]: () => x,
  equals: (other) => other.isRight && other[unsafeGet]() === x,
  swap: () => left(x),
  map: (onRight) => right(onRight(x)),
  tap: (onRight) => right(tap(onRight, x)),
  leftMap: () => right(x),
  leftTap: () => right(x),
  bimap: (_, onRight) => right(onRight(x)),
  bitap: (_, onRight) => right(tap(onRight, x)),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chain: (onRight) => onRight(x) as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ap: (other) => (other.isRight ? (right(other[unsafeGet]()(x)) as any) : right(x)),
  getOrElse: () => x,
  fold: (_, onRight) => onRight(x),
})

export const Either: IEitherStatic = {
  isLeft: false,
  isRight: false,
  try: <TRight, TLeft extends Error = Error>(thunk: () => TRight) => {
    try {
      return right(thunk())
    } catch (error) {
      return left(error as TLeft)
    }
  },
  fromNullable: (x) => (x != null ? right(x) : left(null)),
  fromBoolean: (x) => (x === true ? right(x) : left(x)),
  right: <TRight, TLeft = unknown>(x: TRight) => right(x) as IEither<TRight, TLeft>,
  left: (x) => left(x),
  of: (x) => right(x),
}
