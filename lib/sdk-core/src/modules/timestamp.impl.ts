/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import * as fns from "./fns.impl"
import * as validations from "./validations.impl"

// --- Impl ---

export const create: Ordo.Timestamp.Create = Date.now
export const guard: Ordo.Timestamp.Guard = validations.is_non_negative_integer

export const is_after: Ordo.Timestamp.IsAfter = fns.gte
export const is_before: Ordo.Timestamp.IsBefore = fns.lt
export const is_within: Ordo.Timestamp.IsWithin = (s, e, v) => is_after(s, v) && is_before(e, v)

// --- Types ---

declare global {
	namespace Ordo.Timestamp {
		export type Instance = number & {}

		export type Create = () => Instance
		export type Guard = Ordo.GenericGuard<Instance>

		export type IsAfter = (inclusive_start: Instance, value: Instance) => boolean
		export type IsBefore = (exclusive_end: Instance, value: Instance) => boolean
		export type IsWithin = (inclusive_start: Instance, exclusive_end: Instance, value: Instance) => boolean
	}
}
