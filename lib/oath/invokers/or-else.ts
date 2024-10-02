// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const or_else_oath =
	<$TResolve, $TReject, $TNewReject>(on_reject: (error: $TReject) => $TNewReject) =>
	(o: Oath<$TResolve, $TReject>) =>
		new Promise<$TResolve>((resolve, reject) =>
			o.is_cancelled ? reject(o.cancellation_reason) : o.cata(resolve as any, reject as any),
		).catch(on_reject)
