import { IEither, IEitherStatic } from "./types"

export const left = <TLeft, TRight = TLeft>(x: TLeft): IEither<TRight, TLeft> => ({
  isLeft: true,
  isRight: false,
  UNSAFE_get: () => x,
  equals: (other) => other.isLeft && other.UNSAFE_get() === x,
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
  UNSAFE_get: () => x,
  equals: (other) => other.isRight && other.UNSAFE_get() === x,
  swap: () => left(x),
  map: (onRight) => right(onRight(x)),
  leftMap: () => right(x),
  bimap: (_, onRight) => right(onRight(x)),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chain: (onRight) => onRight(x) as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ap: (other) => (other.isRight ? (right(other.UNSAFE_get()(x)) as any) : right(x)),
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
  fromBoolean: (x) => (x ? right(true) : left(false)),
  right: <TRight, TLeft = unknown>(x: TRight) => right(x) as IEither<TRight, TLeft>,
  left: (x) => left(x),
  of: (x) => right(x),
}
