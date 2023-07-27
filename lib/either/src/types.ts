// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

// TODO: Add comments

import type { T as TAU } from "#lib/tau/mod.ts"

export type LeftFn = <L, R = unknown>(x: L) => Either<R, L>
export type RightFn = <R, L = unknown>(x: R) => Either<R, L>

export type Either<R, L> = {
	readonly isLeft: boolean
	readonly isRight: boolean
	readonly isEither: boolean
	UNSAFE_get: () => L | R
	map: <R1>(f: (x: R) => R1) => Either<R1, L>
	leftMap: <L1>(f: (x: L) => L1) => Either<R, L1>
	getOrElse: <L1>(f: (x: L) => L1) => R | L1
	chain: <R1, L1>(f: (x: R) => Either<R1, L1>) => Either<R1, L | L1>
	fold: <R1, L1>(f: (x: L) => L1, g: (x: R) => R1) => L1 | R1
}

export type EitherStatic = {
	fromNullable: <R>(x: TAU.Nullable<R>) => Either<NonNullable<R>, null>
	fromBoolean: <R, L = undefined>(f: () => boolean, r: () => R, l?: () => L) => Either<R, L>
	try: <R, L>(f: () => R) => Either<R, L>
	right: RightFn
	left: LeftFn
	of: RightFn
}
