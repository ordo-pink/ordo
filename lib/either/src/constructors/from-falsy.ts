import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const fromFalsyE = <TRight>(value: TRight): TEither<TRight, null> =>
	value ? Either.right(value) : Either.left(null)
