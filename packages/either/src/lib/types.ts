import { UnaryFn, Nullable, ThunkFn } from "@ordo-pink/common-types"

export interface IEitherStatic {
  readonly isLeft: false
  readonly isRight: false
  try: <TRight, TLeft extends Error>(thunk: ThunkFn<TRight>) => IEither<TRight, TLeft>
  fromNullable: <TRight>(x: Nullable<TRight>) => IEither<TRight, null>
  fromBoolean: (x: unknown) => IEither<true, false>
  right: <TRight, TLeft = unknown>(x: TRight) => IEither<TRight, TLeft>
  left: <TLeft, TRight = unknown>(x: TLeft) => IEither<TRight, TLeft>
  of: <TRight, TLeft = unknown>(x: TRight) => IEither<TRight, TLeft>
}

export interface IEither<TRight, TLeft = unknown> {
  readonly isLeft: boolean
  readonly isRight: boolean
  UNSAFE_get: () => TLeft | TRight
  equals: <TOtherContext>(other: IEither<TRight | TLeft | TOtherContext>) => boolean
  swap: () => IEither<TLeft, TRight>
  map: <TNewRight>(
    onRight: UnaryFn<TRight, TNewRight> | ThunkFn<TNewRight>,
  ) => IEither<TNewRight, TLeft>
  bimap: <TNewRight, TNewLeft = TNewRight>(
    onLeft: UnaryFn<TLeft, TNewLeft> | ThunkFn<TNewLeft>,
    onRight: UnaryFn<TRight, TNewRight> | ThunkFn<TNewRight>,
  ) => IEither<TNewRight, TNewLeft>
  leftMap: <TNewLeft>(
    onLeft: UnaryFn<TLeft, TNewLeft> | ThunkFn<TNewLeft>,
  ) => IEither<TRight, TNewLeft>
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
