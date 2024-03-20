// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const chain0 =
	<Resolve, Reject, NewResolve, NewReject>(
		onResolved: (x: Resolve) => Oath<NewResolve, NewReject>,
	) =>
	(o: Oath<Resolve, Reject>): Oath<NewResolve, Reject | NewReject> =>
		new Oath(
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			(resolve, reject) =>
				o.fork(
					a => (o.isCancelled ? reject(o.cancellationReason as any) : reject(a)),
					b =>
						o.isCancelled
							? reject(o.cancellationReason as any)
							: onResolved(b).fork(reject, resolve),
				),
			o._abortController,
		)
