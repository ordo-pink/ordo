// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const rejectedMap0 =
	<Resolve, Reject, NewReject>(onRejected: (x: Reject) => NewReject) =>
	(o: Oath<Resolve, Reject>): Oath<Resolve, NewReject> =>
		new Oath<Resolve, NewReject>(
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			(resolve, reject) =>
				o.fork(
					a => (o.isCancelled ? reject(o.cancellationReason as any) : reject(onRejected(a))),
					b => (o.isCancelled ? reject(o.cancellationReason as any) : resolve(b)),
				),
			o._abortController,
		)
