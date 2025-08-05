/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { create, from_promise } from "../../constructors"
import { Oath } from "../../oath.types"

export const fix_op: Oath.Ops.Fix = on_reject => o =>
	create((resolve, reject) =>
		o.cata({
			resolve: resolved => resolve(resolved),
			reject: rejected => {
				try {
					const forked: any = on_reject(rejected)

					if (!forked) return resolve(forked)
					if (forked.is_oath) return forked.cata({ reject, resolve })
					if (forked.then) return from_promise(() => forked).cata({ resolve, reject } as any)
					return resolve(forked)
				} catch (e) {
					return reject(e as never)
				}
			},
		}),
	) as any
