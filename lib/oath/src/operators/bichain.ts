// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

// deno-lint-ignore-file no-explicit-any

import { Oath } from "../impl.ts"

export const bichain_oath =
	<$TResolve, $TReject, $TNewResolve, $TNewReject>(
		on_reject: (x: $TReject) => Oath<$TNewReject, any>,
		on_resolve: (x: $TResolve) => Oath<$TNewResolve, any>,
	) =>
	(o: Oath<$TResolve, $TReject>): Oath<$TNewResolve, $TNewReject> =>
		new Oath<$TNewResolve, $TNewReject>(
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			(resolve, reject) =>
				o.fork(
					a =>
						o.is_cancelled
							? reject(o.cancellation_reason as any)
							: on_reject(a).fork(reject, resolve as any),
					b =>
						o.is_cancelled
							? reject(o.cancellation_reason as any)
							: on_resolve(b).fork(reject, resolve),
				),
			o._abort_controller,
		)
