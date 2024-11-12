// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

// deno-lint-ignore-file no-explicit-any

import type { Oath } from "./oath.impl.ts"

export const invokers0 = {
	force_resolve: <$TResolve, $TReject>(
		o: Oath<$TResolve, $TReject>,
	): Promise<$TResolve | $TReject> =>
		new Promise<$TResolve | $TReject>((resolve, reject) => {
			o.is_cancelled ? reject(o.cancellation_reason) : o.cata(resolve as any, resolve as any)
		}),

	or_else:
		<$TResolve, $TReject, $TNewReject>(on_reject: (error: $TReject) => $TNewReject) =>
		(o: Oath<$TResolve, $TReject>): Promise<$TResolve | $TNewReject> =>
			new Promise<$TResolve | $TNewReject>((resolve, reject) =>
				o.is_cancelled ? reject(o.cancellation_reason) : o.cata(resolve as any, reject as any),
			).catch(on_reject),

	or_nothing: <$TResolve, $TReject>(o: Oath<$TResolve, $TReject>): Promise<$TResolve | undefined> =>
		new Promise<$TResolve | undefined>((resolve, reject) => {
			o.is_cancelled ? reject(o.cancellation_reason) : o.cata(resolve as any, reject as any)
		}).catch(() => void 0),

	to_promise: <$TResolve, $TReject>(o: Oath<$TResolve, $TReject>): Promise<$TResolve> =>
		new Promise<$TResolve>((resolve, reject) => {
			o.is_cancelled ? reject(o.cancellation_reason) : o.cata(resolve as any, reject as any)
		}),
}
