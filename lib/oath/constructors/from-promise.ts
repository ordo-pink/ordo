// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const from_promise_oath = <$TResolve, $TReject = Error>(
	thunk: () => Promise<$TResolve>,
	abort_controller = new AbortController(),
): Oath<$TResolve, $TReject> =>
	new Oath((resolve, reject) => thunk().then(resolve, reject), abort_controller)
