import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const bitapE =
	<TRight, TLeft>(onLeft: (x: TLeft) => any, onRight: (x: TRight) => any) =>
	(e: TEither<TRight, TLeft>): TEither<TRight, TLeft> =>
		e.fold(
			x => {
				onLeft(x)
				return Either.left(x)
			},
			x => {
				onRight(x)
				return Either.right(x)
			},
		)
