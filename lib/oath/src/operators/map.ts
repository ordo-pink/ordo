/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

// deno-lint-ignore-file no-explicit-any

import { Oath } from "../oath.impl.ts"

export const map_oath =
	<$TResolve, $TReject, $TNewResolve>(on_resolve: (x: $TResolve) => $TNewResolve) =>
	(o: Oath<$TResolve, $TReject>): Oath<$TNewResolve, $TReject> =>
		new Oath<$TNewResolve, $TReject>(
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			(resolve, reject) =>
				o.fork(
					a => (o.is_cancelled ? reject(o.cancellation_reason as any) : reject(a)),
					b => (o.is_cancelled ? reject(o.cancellation_reason as any) : resolve(on_resolve(b))),
				),
			o._abort_controller,
		)
