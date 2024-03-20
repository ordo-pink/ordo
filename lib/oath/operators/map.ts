// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const map0 =
	<Resolve, Reject, NewResolve>(onResolved: (x: Resolve) => NewResolve) =>
	(o: Oath<Resolve, Reject>): Oath<NewResolve, Reject> =>
		new Oath<NewResolve, Reject>(
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			(resolve, reject) =>
				o.fork(
					a => (o.isCancelled ? reject(o.cancellationReason as any) : reject(a)),
					b => (o.isCancelled ? reject(o.cancellationReason as any) : resolve(onResolved(b))),
				),
			o._abortController,
		)
