import { UnaryFn } from "./types"

export const id = <T>(x: T): T => x

export const tap =
	<T>(f: UnaryFn<T, any>) =>
	(x: T): T => {
		f(x)

		return x
	}
