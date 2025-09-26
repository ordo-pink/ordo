/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import * as fns from "./fns.impl"
import * as timestamp from "./timestamp.impl"
import * as validations from "./validations.impl"

// --- Impl ---

export const guard: Ordo.Session.Guard = (x): x is Ordo.Session.Instance =>
	validations.is_array(x) && timestamp.guard(x[0]) && validations.is_non_empty_string(x[1])

export const get_issued_at: Ordo.Session.GetIssuedAt = fns.prop(0)
export const get_name: Ordo.Session.GetName = fns.prop(1)

export const was_active_in: Ordo.Session.WasActiveIn = (t, s) => timestamp.create() - s[0] <= t * 1000

// --- Types ---

declare global {
	namespace Ordo.Session {
		/** Time at which the session was issued. */
		export type IssuedAt = Timestamp.Instance

		/** Readable name of the session to be displayed to the user. */
		export type Name = string

		export type Instance = [issued_at: IssuedAt, name: Name]

		export type GetIssuedAt = (session: Instance) => IssuedAt
		export type GetName = (session: Instance) => Name

		export type Guard = GenericGuard<Instance>

		/** Checks whether the session was issued in this many seconds back from now. */
		export type WasActiveIn = (seconds: number, session: Instance) => boolean
	}
}
