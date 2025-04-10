/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Oath } from "../oath.types"
import { if_ok_cata } from "./impl/if-ok.impl"
import { noop_cata } from "./impl/noop.impl"
import { or_else_cata } from "./impl/or-else.impl"
import { to_promise_cata } from "./impl/to-promise.impl"
import { unwrap_cata } from "./impl/unwrap.impl"

export * from "./impl/if-ok.impl"
export * from "./impl/noop.impl"
export * from "./impl/or-else.impl"
export * from "./impl/to-promise.impl"
export * from "./impl/unwrap.impl"

export const catas: Oath.Catas.Static = {
	if_ok: if_ok_cata,
	noop: noop_cata,
	or_else: or_else_cata,
	to_promise: to_promise_cata,
	unwrap: unwrap_cata,
}
