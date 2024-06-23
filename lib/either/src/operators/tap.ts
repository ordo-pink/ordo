import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const tapE =
	<TRight, TLeft>(onRight: (x: TRight) => any) =>
	(e: TEither<TRight, TLeft>): TEither<TRight, TLeft> =>
		e.fold(
			x => Either.left(x),
			x => {
				onRight(x)
				return Either.right(x)
			},
		)
