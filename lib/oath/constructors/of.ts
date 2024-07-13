// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const of_oath = <$TResolve, $TReject = never>(
	value: $TResolve,
	abort_controller = new AbortController(),
): Oath<$TResolve, $TReject> => new Oath(resolve => resolve(value), abort_controller)

export const resolve_oath = of_oath

export const reject_oath = <$TReject, $TResolve = never>(
	value?: $TReject,
	abort_controller = new AbortController(),
): Oath<$TResolve, $TReject> => new Oath((_, reject) => reject(value), abort_controller)
