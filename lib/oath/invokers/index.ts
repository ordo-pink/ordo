// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { or_else_oath } from "./or-else"
import { or_nothing_oath } from "./or-nothing"
import { to_promise_oath } from "./to-promise"

export * from "./or-else"
export * from "./or-nothing"
export * from "./to-promise"

export const invokers = {
	or_else: or_else_oath,
	or_nothing: or_nothing_oath,
	to_promise: to_promise_oath,
}
