import type { Thunk, Nullable, UnaryFn } from "@core/types"

const unsafeGet = Symbol("EitherUnsafeGet")

export interface IEitherStatic {
  readonly isLeft: false
  readonly isRight: false
  try: <TRight, TLeft extends Error>(thunk: Thunk<TRight>) => IEither<TRight, TLeft>
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
    onRight: UnaryFn<TRight, TNewRight> | Thunk<TNewRight>
  ) => IEither<TNewRight, TLeft>
  bimap: <TNewRight, TNewLeft = TNewRight>(
    onLeft: UnaryFn<TLeft, TNewLeft> | Thunk<TNewLeft>,
    onRight: UnaryFn<TRight, TNewRight> | Thunk<TNewRight>
  ) => IEither<TNewRight, TNewLeft>
  leftMap: <TNewLeft>(
    onLeft: UnaryFn<TLeft, TNewLeft> | Thunk<TNewLeft>
  ) => IEither<TRight, TNewLeft>
  chain: <TNewRight>(
    onRight: UnaryFn<TRight, IEither<TNewRight, TLeft>> | Thunk<IEither<TNewRight, TLeft>>
  ) => IEither<TNewRight, TLeft>
  ap: <TNewRight, TNewLeft = TLeft>(
    other: IEither<UnaryFn<TRight, TNewRight>, UnaryFn<TRight, TNewLeft>>
  ) => IEither<TNewRight, TLeft>
  getOrElse: <TNewLeft>(onLeft: UnaryFn<TLeft, TNewLeft> | Thunk<TNewLeft>) => TRight | TNewLeft
  fold: <TNewRight, TNewLeft = TNewRight>(
    onLeft: UnaryFn<TLeft, TNewLeft> | Thunk<TNewLeft>,
    onRight: UnaryFn<TRight, TNewRight> | Thunk<TNewRight>
  ) => TNewLeft | TNewRight
}

export const left = <TLeft, TRight = TLeft>(x: TLeft): IEither<TRight, TLeft> => ({
  isLeft: true,
  isRight: false,
  [unsafeGet]: () => x,
  equals: (other) => other.isLeft && other[unsafeGet]() === x,
  swap: () => right(x),
  map: () => left(x),
  leftMap: (onLeft) => left(onLeft(x)),
  bimap: (onLeft) => left(onLeft(x)),
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
  leftMap: () => right(x),
  bimap: (_, onRight) => right(onRight(x)),
  chain: (onRight) => onRight(x),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ap: (other) => (other.isRight ? (right(other[unsafeGet]()(x)) as any) : right(x)),
  getOrElse: () => x,
  fold: (_, onRight) => onRight(x),
})

const Either: IEitherStatic = {
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

export default Either
