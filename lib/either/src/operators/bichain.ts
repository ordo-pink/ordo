import { TEither } from "../either.types"

export const bichainE =
	<TRight, TLeft, TNewRight, TNewLeft, TOtherLeft>(
		onLeft: (x: TLeft) => TEither<never, TNewLeft>,
		onRight: (x: TRight) => TEither<TNewRight, TOtherLeft>,
	) =>
	(e: TEither<TRight, TLeft>): TEither<TNewRight, TOtherLeft | TNewLeft> =>
		e.fold(
			x => onLeft(x),
			x => onRight(x),
		)
