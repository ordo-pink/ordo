import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const leftChainE =
	<TRight, TLeft, TNewLeft>(onLeft: (x: TLeft) => TEither<never, TNewLeft>) =>
	(e: TEither<TRight, TLeft>): TEither<TRight, TNewLeft> =>
		e.fold(
			x => onLeft(x),
			x => Either.right(x),
		)
