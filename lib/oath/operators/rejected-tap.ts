// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const rejectedTap0 =
	<Resolve, Reject>(onRejected: (x: Reject) => any) =>
	(o: Oath<Resolve, Reject>): Oath<Resolve, Reject> =>
		new Oath<Resolve, Reject>(
			(resolve, reject) =>
				o.fork(
					a => {
						if (o.isCancelled) {
							return reject(o.cancellationReason as any)
						}

						onRejected(a)
						return reject(a)
					},
					b => {
						if (o.isCancelled) {
							return reject(o.cancellationReason as any)
						}

						return resolve(b)
					},
				),
			o._abortController,
		)
