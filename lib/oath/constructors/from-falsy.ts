// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const fromFalsy0 = <Resolve, Reject = null>(
	value: Resolve,
	onFalse: Reject = null as any,
	abortController = new AbortController(),
): Oath<Resolve, Reject> =>
	value ? Oath.resolve(value, abortController) : Oath.reject(onFalse, abortController)

export const fromBoolean0 = <Resolve, Reject = null>(
	value: boolean,
	onTrue: Resolve,
	onFalse: Reject = null as any,
	abortController = new AbortController(),
): Oath<Resolve, Reject> =>
	value ? Oath.resolve(onTrue, abortController) : Oath.reject(onFalse, abortController)
