import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const swapE =
	() =>
	<TRight, TLeft>(e: TEither<TRight, TLeft>): TEither<TLeft, TRight> =>
		e.fold(
			x => Either.right(x),
			x => Either.left(x),
		)
