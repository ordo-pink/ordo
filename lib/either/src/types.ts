// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Nullable } from "@ordo-pink/tau"

// TODO: Add comments

export type LeftFn = <L, R = unknown>(x: L) => TEither<R, L>
export type RightFn = <R, L = unknown>(x: R) => TEither<R, L>

export type TEither<R, L> = {
	readonly isLeft: boolean
	readonly isRight: boolean
	readonly isEither: boolean
	UNSAFE_get: () => L | R
	map: <R1>(f: (x: R) => R1) => TEither<R1, L>
	leftMap: <L1>(f: (x: L) => L1) => TEither<R, L1>
	getOrElse: <L1>(f: (x: L) => L1) => R | L1
	chain: <R1, L1>(f: (x: R) => TEither<R1, L1>) => TEither<R1, L | L1>
	fold: <R1, L1>(f: (x: L) => L1, g: (x: R) => R1) => L1 | R1
}

export type EitherStatic = {
	fromNullable: <R>(x: Nullable<R>) => TEither<NonNullable<R>, null>
	fromBoolean: <R = undefined, L = undefined>(
		f: () => boolean,
		r?: () => R,
		l?: () => L,
	) => TEither<R, L>
	try: <R, L>(f: () => R) => TEither<R, L>
	right: RightFn
	left: LeftFn
	of: RightFn
}
