/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

// deno-lint-ignore-file no-explicit-any

import { Oath } from "../oath.impl.ts"

export const rejected_map_oath =
	<$TResolve, $TReject, $TNewReject>(on_reject: (x: $TReject) => $TNewReject) =>
	(o: Oath<$TResolve, $TReject>): Oath<$TResolve, $TNewReject> =>
		new Oath<$TResolve, $TNewReject>(
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			(resolve, reject) =>
				o.fork(
					a => (o.is_cancelled ? reject(o.cancellation_reason as any) : reject(on_reject(a))),
					b => (o.is_cancelled ? reject(o.cancellation_reason as any) : resolve(b)),
				),
			o._abort_controller,
		)
