// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const bitap0 =
	<Resolve, Reject>(onRejected: (x: Reject) => any, onResolved: (x: Resolve) => any) =>
	(o: Oath<Resolve, Reject>): Oath<Resolve, Reject> =>
		new Oath<Resolve, Reject>(
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			(resolve, reject) =>
				o.fork(
					a => {
						onRejected(a)
						return reject(a)
					},
					b => {
						if (o.isCancelled) {
							return reject(o.cancellationReason as any)
						}

						onResolved(b)
						return resolve(b)
					},
				),
			o._abortController,
		)
