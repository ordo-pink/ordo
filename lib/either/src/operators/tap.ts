/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const tapE =
	<TRight, TLeft>(onRight: (x: TRight) => any) =>
	(e: TEither<TRight, TLeft>): TEither<TRight, TLeft> =>
		e.fold(
			x => Either.left(x),
			x => {
				onRight(x)
				return Either.right(x)
			},
		)
