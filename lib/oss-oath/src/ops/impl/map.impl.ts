/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Oath } from "../../oath.types"
import { create } from "../../constructors"

export const map_op: Oath.Ops.Map = f => o => create((resolve, reject) => o.cata({ reject, resolve: x => resolve(f(x)) }))

export const rejected_map_op: Oath.Ops.RMap = f => o =>
	create((resolve, reject) => o.cata({ reject: x => reject(f(x)), resolve }))

export const bimap_op: Oath.Ops.BiMap = (f, g) => o =>
	create((resolve, reject) => o.cata({ reject: x => reject(g(x)), resolve: x => resolve(f(x)) }))
