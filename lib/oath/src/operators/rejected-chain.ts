/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

// deno-lint-ignore-file no-explicit-any

import { Oath } from "../oath.impl.ts"

export const rejected_chain_oath =
	<$TResolve, $TReject, $TNewReject>(on_reject: (x: $TReject) => Oath<$TResolve, $TNewReject>) =>
	(o: Oath<$TResolve, $TReject>): Oath<$TResolve, $TNewReject> =>
		new Oath(
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			(resolve, reject) =>
				o.fork(
					a => (o.is_cancelled ? reject(o.cancellation_reason as any) : on_reject(a).fork(reject, resolve)),
					b => (o.is_cancelled ? o : resolve(b)),
				),
			o._abort_controller,
		)
