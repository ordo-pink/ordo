// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const fixE =
	<TRight, TLeft, TNewRight>(onLeft: (x: TLeft) => TNewRight) =>
	(e: TEither<TRight, TLeft>): TEither<TRight | TNewRight, never> =>
		e.fold(
			x => Either.of(onLeft(x)),
			x => Either.of(x),
		)
