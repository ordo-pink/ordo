// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

// deno-lint-ignore-file no-explicit-any

import type * as T from "./types"

export const isObject = (x: unknown): x is Record<string, unknown> =>
	x != null && typeof x === "object" && !Array.isArray(x)

export const isFunction = <T = unknown, K = T>(x: unknown): x is (x: T) => K =>
	typeof x == "function"

export const isArray = Array.isArray
export const isDate = (x: unknown): x is Date => !!x && x instanceof Date
export const isString = (x: unknown): x is string => !!x && typeof x === "string"

export const keysOf: T._KeysOfFn = o => {
	return Object.keys(o) as any
}

export const noop = () => {}

export const callOnce = <T extends any[], R>(fn: (...args: T) => R) => {
	let wasCalled = false

	return (...args: T): R => {
		if (wasCalled) return void 0 as unknown as R

		const result = fn(...args)

		wasCalled = true

		return result
	}
}
