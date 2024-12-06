/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 *
 */

import { Either } from "../either.impl"
import { TEither } from "../either.types"

export const fromFalsyE = <TRight>(value: TRight): TEither<TRight, null> => (value ? Either.right(value) : Either.left(null))
