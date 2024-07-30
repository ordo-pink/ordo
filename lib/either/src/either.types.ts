// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

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
	/** @deprecated */
	UNSAFE_get: () => L | R
	/** @deprecated */
	map: <R1>(f: (x: R) => R1) => TEither<R1, L>
	/** @deprecated */
	leftMap: <L1>(f: (x: L) => L1) => TEither<R, L1>
	/** @deprecated */
	getOrElse: <L1>(f: (x: L) => L1) => R | L1
	/** @deprecated */
	chain: <R1, L1>(f: (x: R) => TEither<R1, L1>) => TEither<R1, L | L1>
	/** @deprecated */
	fix: <R1>(f: (x: L) => R1) => TEither<R | R1, never>
	pipe: <R1, L1>(operator: (l: TEither<R, L>) => TEither<R1, L1>) => TEither<R1, L1>
	fold: <R1, L1>(onLeft: (x: L) => L1, onRight: (x: R) => R1) => L1 | R1
}

export type EitherStatic = {
	/** @deprecated */
	fromNullable: <R>(x?: R | null) => TEither<NonNullable<R>, null>
	/** @deprecated */
	fromBoolean: <R = undefined, L = undefined>(
		f: () => boolean,
		r?: () => R,
		l?: () => L,
	) => TEither<R, L>
	/** @deprecated */
	try: <R, L>(f: () => R) => TEither<R, L>
	right: RightFn
	left: LeftFn
	of: RightFn
}
