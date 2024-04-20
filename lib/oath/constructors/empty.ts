// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const empty0 = <Reject = never>(
	abortController = new AbortController(),
): Oath<void, Reject> => new Oath(resolve => resolve(undefined), abortController)
