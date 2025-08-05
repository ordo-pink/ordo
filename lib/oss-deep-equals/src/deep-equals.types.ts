/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

/**
 * # deep_equals
 *
 * Checks deep equality of two provided elements. Recursively checks equality for objects and arrays.
 *
 * ## Usage
 *
 * ```typescript
 * import { deep_equals } from "@ordo-pink/deep-equals"
 *
 * const a = { hello: "world" }
 * const b = { hello: "world" }
 *
 * console.log(deep_equals(a, b)) // true
 * ```
 * @module
 */
export namespace DeepEquals {
	/**
	 * Checks deep equality of two provided elements. Recursively checks equality for objects and arrays.
	 */
	export type Module = (x: unknown, y: unknown) => boolean
}
