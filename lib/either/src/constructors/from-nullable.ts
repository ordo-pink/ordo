import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const fromNullableE = <TRight>(value: TRight | null | undefined): TEither<TRight, null> =>
	value != null ? Either.right(value) : Either.left(null)
