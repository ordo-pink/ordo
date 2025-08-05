/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import * as UUID from "./uuid.constants"
import type * as Uuid from "./uuid.types"

export const create: Uuid.Create = () => crypto.randomUUID()
export const guard: Uuid.Guard = (x): x is Uuid.Instance => typeof x === "string" && UUID.RX.test(x)
