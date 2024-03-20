// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const bichain0 =
	<Resolve, Reject, NewResolve, NewReject>(
		onRejected: (x: Reject) => Oath<NewReject, any>,
		onResolved: (x: Resolve) => Oath<NewResolve, any>,
	) =>
	(o: Oath<Resolve, Reject>): Oath<NewResolve, NewReject> =>
		new Oath<NewResolve, NewReject>(
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			(resolve, reject) =>
				o.fork(
					a =>
						o.isCancelled
							? reject(o.cancellationReason as any)
							: onRejected(a).fork(reject, resolve as any),
					b =>
						o.isCancelled
							? reject(o.cancellationReason as any)
							: onResolved(b).fork(reject, resolve),
				),
			o._abortController,
		)
