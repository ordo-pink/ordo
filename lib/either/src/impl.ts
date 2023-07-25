// SPDX-FileCopyrightText: Copyright 2023, Sergei Orlov and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

// deno-lint-ignore-file no-explicit-any

import type * as T from "./types.ts"

const left: T.LeftFn = x => ({
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

const right: T.RightFn = x => ({
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

export const Either: T.EitherStatic = {
	fromNullable: x => (x == null ? left(null) : right(x)),
	fromBoolean: (f, r, l?) => (f() ? right(r()) : left(l ? l() : undefined)) as any,
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
