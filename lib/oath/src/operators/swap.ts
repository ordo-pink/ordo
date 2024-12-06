/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

// deno-lint-ignore-file no-explicit-any

import { Oath } from "../oath.impl.ts"

export const swap_oath = <$TResolve, $TReject>(oath: Oath<$TResolve, $TReject>): Oath<$TReject, $TResolve> =>
	new Oath<$TReject, $TResolve>(
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		(resolve, reject) =>
			oath.fork(
				a => (oath.is_cancelled ? reject(oath.cancellation_reason as any) : resolve(a)),
				b => reject(b),
			),
		oath._abort_controller,
	)
