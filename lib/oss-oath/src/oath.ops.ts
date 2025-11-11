/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as Oath from "./oath.types"
import { create, from_promise } from "./oath.impl"

export const and: Oath.And = on_resolve => o =>
	create((resolve, reject) =>
		o.cata({
			resolve: resolved => {
				try {
					const forked = on_resolve(resolved) as any

					if (!forked) return resolve(forked)
					if (forked.is_oath) return forked.cata({ reject, resolve })
					if (forked.then) return from_promise(() => forked).cata({ resolve, reject }) as any
					return resolve(forked)
				} catch (e) {
					return reject(e)
				}
			},
			reject: rejected => reject(rejected),
		}),
	) as any

export const ap: Oath.Ap = x => o =>
	create((resolve, reject) =>
		o.pipe(
			map(f =>
				x.cata({
					reject: x => reject(x),
					resolve: x => resolve(f(x)),
				}),
			),
		),
	)

export const chain: Oath.Chain = on_resolve => o =>
	create((resolve, reject) => o.cata({ reject, resolve: x => on_resolve(x).cata({ reject, resolve }) }))

export const rchain: Oath.RChain = on_reject => o =>
	create((resolve, reject) => o.cata({ reject: x => on_reject(x).cata({ reject, resolve }), resolve }))

export const fix: Oath.Fix = on_reject => o =>
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

export const map: Oath.Map = f => o => create((resolve, reject) => o.cata({ reject, resolve: x => resolve(f(x)) }))

export const rmap: Oath.RMap = f => o => create((resolve, reject) => o.cata({ reject: x => reject(f(x)), resolve }))

export const bimap: Oath.BiMap = (f, g) => o =>
	create((resolve, reject) => o.cata({ reject: x => reject(g(x)), resolve: x => resolve(f(x)) }))

export const swap: Oath.Swap = o => create((resolve, reject) => o.cata({ reject: x => resolve(x), resolve: x => reject(x) }))

export const tap: Oath.Tap = (f, g) => o =>
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

export const rtap: Oath.RTap = (g, f) => o =>
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
