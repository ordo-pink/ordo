import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const bimapE =
	<TRight, TLeft, TNewRight, TNewLeft>(
		onLeft: (x: TLeft) => TNewLeft,
		onRight: (x: TRight) => TNewRight,
	) =>
	(e: TEither<TRight, TLeft>): TEither<TNewRight, TNewLeft> =>
		e.fold(
			x => Either.left(onLeft(x)),
			x => Either.right(onRight(x)),
		)
