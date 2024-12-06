/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

// deno-lint-ignore-file no-explicit-any

import { Oath } from "../oath.impl.ts"

export const bitap_oath =
	<$TResolve, $TReject>(on_reject: (x: $TReject) => any, on_resolve: (x: $TResolve) => any) =>
	(o: Oath<$TResolve, $TReject>): Oath<$TResolve, $TReject> =>
		new Oath<$TResolve, $TReject>(
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			(resolve, reject) =>
				o.fork(
					a => {
						if (o.is_cancelled) {
							return reject(o.cancellation_reason as any)
						}

						on_reject(a)
						return reject(a)
					},
					b => {
						if (o.is_cancelled) {
							return reject(o.cancellation_reason as any)
						}

						on_resolve(b)
						return resolve(b)
					},
				),
			o._abort_controller,
		)
