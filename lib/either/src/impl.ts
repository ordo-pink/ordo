// deno-lint-ignore-file no-explicit-any
import type { TLeftFn, TRightFn, TEitherStatic } from "./types.ts"

const left: TLeftFn = x => ({
	isEither: true,
	isLeft: true,
	isRight: false,
	UNSAFE_get: () => x,
	map: () => left(x),
	leftMap: f => left(f(x)),
	getOrElse: f => f(x),
	chain: () => left(x),
	fold: f => f(x),
})

const right: TRightFn = x => ({
	isEither: true,
	isLeft: false,
	isRight: true,
	UNSAFE_get: () => x,
	map: f => right(f(x)),
	leftMap: () => right(x),
	getOrElse: () => x,
	chain: f => f(x),
	fold: (_, g) => g(x),
})

export const Either: TEitherStatic = {
	fromNullable: x => (x == null ? left(null) : right(x)),
	fromBoolean: (f, x, l?) => (f() ? right(x) : left(l)) as any,
	fromBooleanLazy: (f, r, l?) =>
		(f() ? right(r()) : left(l ? l() : undefined)) as any,
	try: f => {
		try {
			return right(f())
		} catch (e) {
			return left(e)
		}
	},
	right,
	left,
	of: right,
}
