// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const leftMapE =
	<TRight, TLeft, TNewLeft>(onLeft: (x: TLeft) => TNewLeft) =>
	(e: TEither<TRight, TLeft>): TEither<TRight, TNewLeft> =>
		e.fold(
			x => Either.left(onLeft(x)),
			x => Either.right(x),
		)
