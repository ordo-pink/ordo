/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as T from "./helpers.types"
import { match } from "../sweech.impl"

export const of_true: T.OfTrue = () => match(true)

export const of_false: T.OfFalse = () => match(false)
