/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const bimapE =
	<TRight, TLeft, TNewRight, TNewLeft>(onLeft: (x: TLeft) => TNewLeft, onRight: (x: TRight) => TNewRight) =>
	(e: TEither<TRight, TLeft>): TEither<TNewRight, TNewLeft> =>
		e.fold(
			x => Either.left(onLeft(x)),
			x => Either.right(onRight(x)),
		)
