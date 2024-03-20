// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const orElse =
	<Resolve, Reject, NewReject>(onRejected: (error: Reject) => NewReject) =>
	(o: Oath<Resolve, Reject>) =>
		new Promise<Resolve>((resolve, reject) =>
			o.isCancelled ? reject(o.cancellationReason) : o._resolver(resolve as any, reject as any),
		).catch(onRejected)
