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
