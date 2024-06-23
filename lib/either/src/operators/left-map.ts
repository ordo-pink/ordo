import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const leftMapE =
	<TRight, TLeft, TNewLeft>(onLeft: (x: TLeft) => TNewLeft) =>
	(e: TEither<TRight, TLeft>): TEither<TRight, TNewLeft> =>
		e.fold(
			x => Either.left(onLeft(x)),
			x => Either.right(x),
		)
