/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const fromNullableE = <TRight, TLeft = null>(
	value: TRight | null | undefined,
	onNull: () => TLeft = () => null as any,
): TEither<TRight, TLeft> => (value != null ? Either.right(value) : Either.left(onNull()))
