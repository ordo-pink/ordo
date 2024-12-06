/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 *
 */

import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const mapE =
	<TRight, TLeft, TNewRight>(onRight: (x: TRight) => TNewRight) =>
	(e: TEither<TRight, TLeft>): TEither<TNewRight, TLeft> =>
		e.fold(
			x => Either.left(x),
			x => Either.right(onRight(x)),
		)
