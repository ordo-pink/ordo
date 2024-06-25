import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const fromNullableE = <TRight, TLeft = null>(
	value: TRight | null | undefined,
	onNull: TLeft = null as any,
): TEither<TRight, TLeft> => (value != null ? Either.right(value) : Either.left(onNull))
