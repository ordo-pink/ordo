import { Either } from "../either.impl"

export const ofE = <TRight, TLeft = never>(value: TRight) => Either.right<TRight, TLeft>(value)

export const rightE = ofE

export const leftE = <TLeft, TRight = never>(value: TLeft) => Either.left<TLeft, TRight>(value)
