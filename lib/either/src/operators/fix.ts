import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const fixE =
	<TRight, TLeft, TNewRight>(onLeft: (x: TLeft) => TNewRight) =>
	(e: TEither<TRight, TLeft>): TEither<TRight | TNewRight, never> =>
		e.fold(
			x => Either.of(onLeft(x)),
			x => Either.of(x),
		)
