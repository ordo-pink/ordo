/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Oath } from "../../oath.types"
import { create } from "../../constructors"

export const swap_op: Oath.Ops.Swap = o =>
	create((resolve, reject) => o.cata({ reject: x => resolve(x), resolve: x => reject(x) }))
