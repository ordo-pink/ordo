/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Oath } from "../../oath.types"
import { create } from "../../constructors/impl/create.impl"

export const tap_op: Oath.Ops.Tap = (f, g) => o =>
	create((on_resolve, on_reject) =>
		o.cata({
			reject: reject => {
				g && g(reject as any)
				return on_reject(reject)
			},
			resolve: resolve => {
				f(resolve)
				return on_resolve(resolve)
			},
		}),
	)

export const rejected_tap_op: Oath.Ops.RTap = (g, f) => o =>
	create((on_resolve, on_reject) =>
		o.cata({
			reject: reject => {
				g(reject as any)
				return on_reject(reject)
			},
			resolve: resolve => {
				f && f(resolve)
				return on_resolve(resolve)
			},
		}),
	)
