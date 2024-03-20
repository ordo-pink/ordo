// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const fromPromise0 = <Resolve, Reject = unknown>(
	thunk: () => Promise<Resolve>,
	abortController = new AbortController(),
): Oath<Resolve, Reject> =>
	new Oath((resolve, reject) => thunk().then(resolve, reject), abortController)
