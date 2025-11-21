/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export namespace CONSTANTS {
	export const FIRSTBORN: Ordo.Uuid.Instance = "00000000-0000-4000-8000-000000000000"
	export const THE_LAST_ONE: Ordo.Uuid.Instance = "ffffffff-ffff-4fff-bfff-ffffffffffff"
}

export namespace impl {
	export const rx = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

	export const create: Ordo.Uuid.Create = () => crypto.randomUUID()
	export const guard: Ordo.Uuid.Guard = (x): x is Ordo.Uuid.Instance => typeof x === "string" && rx.test(x)
}

declare global {
	namespace Ordo.Uuid {
		export type Instance = `${string}-${string}-${string}-${string}-${string}`

		export type Guard = GenericGuard<Instance>

		export type Create = () => Instance
	}
}
