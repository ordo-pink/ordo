/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

// deno-lint-ignore-file no-explicit-any

import { Oath } from "../oath.impl.ts"

export const rejected_tap_oath =
	<$TResolve, $TReject>(on_reject: (x: $TReject) => any) =>
	(o: Oath<$TResolve, $TReject>): Oath<$TResolve, $TReject> =>
		new Oath<$TResolve, $TReject>(
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

						return resolve(b)
					},
				),
			o._abort_controller,
		)
