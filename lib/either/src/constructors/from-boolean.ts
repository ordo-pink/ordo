import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const fromBooleanE = <TRight, TLeft = undefined>(
	validate: boolean,
	right: TRight,
	left?: TLeft,
): TEither<TRight, TLeft> => (validate ? Either.right(right) : Either.left(left as TLeft))
