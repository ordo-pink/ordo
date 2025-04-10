/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { create, from_promise } from "../../constructors"
import { Oath } from "../../oath.types"

export const and_op: Oath.Operators.And = on_resolve => o =>
	create((resolve, reject) =>
		o.cata({
			resolve: resolved => {
				try {
					const forked: any = on_resolve(resolved)

					if (!forked) return resolve(forked)
					if (forked.is_oath) return forked.cata({ reject, resolve })
					if (forked.then) return from_promise(() => forked).cata({ resolve, reject }) as any
					return resolve(forked)
				} catch (e) {
					reject(e instanceof Error ? e : (new Error(String(e)) as any))
				}
			},
			reject: rejected => reject(rejected),
		}),
	) as any
