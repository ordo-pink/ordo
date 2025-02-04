/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { EitherStatic, LeftFn, RightFn } from "./either.types"

const left: LeftFn = x => ({
	isEither: true,
	isLeft: true,
	isRight: false,
	UNSAFE_get: () => x,
	map: () => left(x),
	leftMap: f => left(f(x)),
	getOrElse: f => f(x),
	chain: () => left(x),
	fix: f => right(f(x)),
	pipe: f => f(left(x)),
	fold: f => f(x),
})

const right: RightFn = x => ({
	isEither: true,
	isLeft: false,
	isRight: true,
	UNSAFE_get: () => x,
	map: f => right(f(x)),
	leftMap: () => right(x),
	getOrElse: () => x,
	chain: f => f(x),
	fix: () => right(x),
	pipe: f => f(right(x)),
	fold: (_, g) => g(x),
})

export const Either: EitherStatic = {
	fromNullable: x => (x == null ? left(null) : right(x)),
	fromBoolean: (f, r?, l?) => (f() ? right(r ? r() : undefined) : left(l ? l() : undefined)) as any,
	try: f => {
		try {
			return right(f())
		} catch (e) {
			return left(e) as any
		}
	},
	right,
	left,
	of: right,
}
