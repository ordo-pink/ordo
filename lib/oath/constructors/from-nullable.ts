// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

type TFromNullable0Fn = <$TResolve, $TReject = null>(
	value?: $TResolve | null,
	on_null?: () => $TReject,
	abort_controller?: AbortController,
) => Oath<NonNullable<$TResolve>, $TReject>
export const from_nullable_oath: TFromNullable0Fn = (
	value,
	on_null = () => null as any,
	abort_controller = new AbortController(),
) =>
	value == null ? Oath.Reject(on_null(), abort_controller) : Oath.Resolve(value, abort_controller)
