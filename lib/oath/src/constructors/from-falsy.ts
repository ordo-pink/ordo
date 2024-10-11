// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../impl.ts"

export const from_falsy_oath = <$TResolve, $TReject = null>(
	value: $TResolve,
	on_false: $TReject = null as unknown as $TReject,
	abort_controller: AbortController = new AbortController(),
): Oath<$TResolve, $TReject> =>
	value ? Oath.Resolve(value, abort_controller) : Oath.Reject(on_false, abort_controller)

export const from_boolean_oath = <$TResolve, $TReject = null>(
	value: boolean,
	on_true: $TResolve,
	on_false: $TReject = null as unknown as $TReject,
	abort_controller: AbortController = new AbortController(),
): Oath<$TResolve, $TReject> =>
	value ? Oath.Resolve(on_true, abort_controller) : Oath.Reject(on_false, abort_controller)
