// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

// deno-lint-ignore-file no-explicit-any

import type { Oath } from "../impl.ts"

export const or_else_oath =
	<$TResolve, $TReject, $TNewReject>(on_reject: (error: $TReject) => $TNewReject) =>
	(o: Oath<$TResolve, $TReject>): Promise<$TResolve | $TNewReject> =>
		new Promise<$TResolve | $TNewReject>((resolve, reject) =>
			o.is_cancelled ? reject(o.cancellation_reason) : o.cata(resolve as any, reject as any),
		).catch(on_reject)
