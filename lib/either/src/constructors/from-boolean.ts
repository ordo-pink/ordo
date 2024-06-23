import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const fromBooleanE = <TRight = undefined, TLeft = undefined>(
	validate: boolean,
	right?: TRight,
	left?: TLeft,
): TEither<TRight, TLeft> => (validate ? Either.right(right as TRight) : Either.left(left as TLeft))
