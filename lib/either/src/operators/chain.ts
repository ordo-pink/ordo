import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const chainE =
	<TRight, TLeft, TNewRight, TNewLeft>(onRight: (x: TRight) => TEither<TNewRight, TNewLeft>) =>
	(e: TEither<TRight, TLeft>): TEither<TNewRight, TLeft | TNewLeft> =>
		e.fold(
			x => Either.left(x),
			x => onRight(x),
		)
