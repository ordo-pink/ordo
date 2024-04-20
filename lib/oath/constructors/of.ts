// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const of0 = <Resolve, Reject = never>(
	value: Resolve,
	abortController = new AbortController(),
): Oath<Resolve, Reject> => new Oath(resolve => resolve(value), abortController)

export const resolve0 = of0

export const reject0 = <Reject, Resolve = never>(
	error?: Reject,
	abortController = new AbortController(),
): Oath<Resolve, Reject> => new Oath((_, reject) => reject(error), abortController)
