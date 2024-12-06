/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const bitapE =
	<TRight, TLeft>(onLeft: (x: TLeft) => any, onRight: (x: TRight) => any) =>
	(e: TEither<TRight, TLeft>): TEither<TRight, TLeft> =>
		e.fold(
			x => {
				onLeft(x)
				return Either.left(x)
			},
			x => {
				onRight(x)
				return Either.right(x)
			},
		)
