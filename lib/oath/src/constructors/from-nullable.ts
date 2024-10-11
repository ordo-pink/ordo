// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../impl.ts"

export const from_nullable_oath = <$TResolve, $TReject = null>(
	value: $TResolve | null,
	on_null: () => $TReject = () => null as unknown as $TReject,
	abort_controller: AbortController = new AbortController(),
): Oath<NonNullable<$TResolve>, $TReject> =>
	value == null ? Oath.Reject(on_null(), abort_controller) : Oath.Resolve(value, abort_controller)
