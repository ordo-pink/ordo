// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const tap_oath =
	<$TResolve, $TReject>(
		on_resolve: (x: $TResolve) => any,
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
