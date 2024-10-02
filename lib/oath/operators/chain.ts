// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const chain_oath =
	<$TResolve, $TReject, $TNewResolve, $TNewReject>(
		on_resolve: (x: $TResolve) => Oath<$TNewResolve, $TNewReject>,
	) =>
	(o: Oath<$TResolve, $TReject>): Oath<$TNewResolve, $TReject | $TNewReject> =>
		new Oath(
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			(resolve, reject) =>
				o.fork(
					a => (o.is_cancelled ? reject(o.cancellation_reason as any) : reject(a)),
					b =>
						o.is_cancelled
							? reject(o.cancellation_reason as any)
							: on_resolve(b).fork(reject, resolve),
				),
			o._abort_controller,
		)
