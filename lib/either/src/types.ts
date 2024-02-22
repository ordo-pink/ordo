// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
	fix: <R1>(f: (x: L) => R1) => TEither<R | R1, never>
	fold: <R1, L1>(f: (x: L) => L1, g: (x: R) => R1) => L1 | R1
}

export type EitherStatic = {
	fromNullable: <R>(x?: R | null) => TEither<NonNullable<R>, null>
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
