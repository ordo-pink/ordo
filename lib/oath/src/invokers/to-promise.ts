// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

// deno-lint-ignore-file no-explicit-any

import type { Oath } from "../impl.ts"

export const to_promise_oath = <$TResolve, $TReject>(
	o: Oath<$TResolve, $TReject>,
): Promise<$TResolve> =>
	new Promise<$TResolve>((resolve, reject) => {
		o.is_cancelled ? reject(o.cancellation_reason) : o.cata(resolve as any, reject as any)
	})
