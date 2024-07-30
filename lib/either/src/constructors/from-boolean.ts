// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const fromBooleanE = <TRight = undefined, TLeft = undefined>(
	validate: boolean,
	right?: TRight,
	left?: TLeft,
): TEither<TRight, TLeft> => (validate ? Either.right(right as TRight) : Either.left(left as TLeft))

export const ifE = <TRight = undefined, TLeft = undefined>(
	validate: boolean,
	{
		onT = () => undefined as TRight,
		onF = () => undefined as TLeft,
	}: { onT?: () => TRight; onF?: () => TLeft } = {
		onT: () => undefined as TRight,
		onF: () => undefined as TLeft,
	},
): TEither<TRight, TLeft> => (validate ? Either.right(onT()) : Either.left(onF()))
