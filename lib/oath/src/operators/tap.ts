/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

// deno-lint-ignore-file no-explicit-any

import { Oath } from "../oath.impl.ts"

/**
 * Applies provided `on_resolve` function on the value wrapped inside the resoled Oath and
 * returns the same value back inside a new Oath. Accepts optional second parameter
 * `on_reject` that will be called if the Oath is in rejected state.
 *
 * @see {@link Oath.pipe}
 *
 * @example
 * ```typescript
 * Oath.Resolve(1)
 * 	.pipe(ops0.tap(console.log))
 * 	.and(x => x + 1)
 * 	.pipe(ops0.tap(console.log))
 * 	.invoke(invokers0.force_resolve)
 *
 * // 1
 * // 2
 * ```
 */
export const tap_oath =
	<$TResolve, $TReject>(
		/**
		 * Handler for a resolved Oath.
		 */
		on_resolve: (x: $TResolve) => any,

		/**
		 * Handler for a rejected Oath.
		 *
		 * @optional
		 */
		on_reject: (x: $TReject) => any = () => void 0,
	) =>
	(o: Oath<$TResolve, $TReject>): Oath<$TResolve, $TReject> =>
		new Oath<$TResolve, $TReject>(
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			(resolve, reject) =>
				o.fork(
					a => {
						if (o.is_cancelled) return reject(o.cancellation_reason as any)

						on_reject(a)
						return reject(a)
					},
					b => {
						if (o.is_cancelled) return reject(o.cancellation_reason as any)

						on_resolve(b)
						return resolve(b)
					},
				),
			o._abort_controller,
		)
