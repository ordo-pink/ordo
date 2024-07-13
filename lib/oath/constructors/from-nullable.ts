// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const from_nullable_oath = <$TResolve, $TReject = null>(
	value?: $TResolve | null,
	on_null = () => null as any,
	abort_controller = new AbortController(),
): Oath<NonNullable<$TResolve>, $TReject> =>
	value == null ? Oath.Reject(on_null(), abort_controller) : Oath.Resolve(value, abort_controller)
