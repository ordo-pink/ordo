// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const rejectedChain0 =
	<Resolve, Reject, NewReject>(onRejected: (x: Reject) => Oath<Resolve, NewReject>) =>
	(o: Oath<Resolve, Reject>): Oath<Resolve, NewReject> =>
		new Oath(
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			(resolve, reject) =>
				o.fork(
					a =>
						o.isCancelled
							? reject(o.cancellationReason as any)
							: onRejected(a).fork(reject, resolve),
					b => (o.isCancelled ? o : resolve(b)),
				),
			o._abortController,
		)
