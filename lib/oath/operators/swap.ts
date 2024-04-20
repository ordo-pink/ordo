// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const swap0 = <Resolve, Reject>(o: Oath<Resolve, Reject>): Oath<Reject, Resolve> =>
	new Oath<Reject, Resolve>(
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		(resolve, reject) =>
			o.fork(
				a => (o.isCancelled ? reject(o.cancellationReason as any) : resolve(a)),
				b => reject(b),
			),
		o._abortController,
	)
