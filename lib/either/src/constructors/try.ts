import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const tryE = <TRight, TLeft = unknown>(f: () => TRight): TEither<TRight, TLeft> => {
	try {
		return Either.right(f())
	} catch (e) {
		return Either.left(e as TLeft)
	}
}
