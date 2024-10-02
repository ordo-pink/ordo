// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const tryE = <TRight, TLeft = unknown>(f: () => TRight): TEither<TRight, TLeft> => {
	try {
		return Either.right(f())
	} catch (e) {
		return Either.left(e as TLeft)
	}
}
