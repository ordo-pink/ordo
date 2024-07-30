// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const swapE =
	() =>
	<TRight, TLeft>(e: TEither<TRight, TLeft>): TEither<TLeft, TRight> =>
		e.fold(
			x => Either.right(x),
			x => Either.left(x),
		)
