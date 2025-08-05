/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as Timestamp from "./timestamp.types"
import * as fns from "../fns/fns.impl"

export const create: Timestamp.Create = Date.now
export const guard: Timestamp.Guard = fns.is_non_negative_integer

export const is_after: Timestamp.IsAfter = fns.gte
export const is_before: Timestamp.IsBefore = fns.lt
export const is_within: Timestamp.IsWithin = (s, e, v) => is_after(s, v) && is_before(e, v)
