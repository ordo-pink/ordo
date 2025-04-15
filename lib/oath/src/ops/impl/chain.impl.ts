/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Oath } from "../../oath.types"
import { create } from "../../constructors"

export const chain_op: Oath.Ops.Chain = on_resolve => o =>
	create((resolve, reject) => o.cata({ reject, resolve: x => on_resolve(x).cata({ reject, resolve }) }))
