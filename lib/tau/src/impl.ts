// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type * as T from "./types"

export const UUIDv4_RX = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

export const N = () => null

export type UUIDv4 = `${string}-${string}-${string}-${string}-${string}`

export type AllKeysRequired<T extends Record<string, any>> = { [K in keyof T]: NonNullable<T[K]> }

export const isObject = (x: unknown): x is Record<string, unknown> =>
	x != null && typeof x === "object" && !Array.isArray(x)

export const isFunction = <T = unknown, K = T>(x: unknown): x is (x: T) => K =>
	typeof x == "function"

export const isArray = Array.isArray
export const isDate = (x: unknown): x is Date => !!x && x instanceof Date
export const isString = (x: unknown): x is string => !!x && typeof x === "string"
export const isNonEmptyString = (x: unknown): x is string => isString(x) && x.trim() !== ""
export const isNumber = (x: unknown): x is number => typeof x === "number"
export const isNegativeNumber = (x: unknown): x is number => isNumber(x) && x < 0
export const isZero = (x: unknown): x is 0 => x === 0
export const isPositiveNumber = (x: unknown): x is number => isNumber(x) && x > 0
export const isNonNegativeNumber = (x: unknown): x is number => isZero(x) || isPositiveNumber(x)
export const isFiniteNumber = (x: unknown): x is number => Number.isFinite(x)
export const isInteger = (x: unknown): x is number => Number.isInteger(x)
export const isNaN = (x: unknown): x is number => Number.isNaN(x)
export const isInfinite = (x: unknown): x is number => isNumber(x) && !isFiniteNumber(x)
export const isNonNegativeFiniteInteger = (x: unknown): x is number =>
	isNonNegativeNumber(x) && isFiniteNumber(x) && isInteger(x)
export const isUUID = (x: unknown): x is UUIDv4 => isString(x) && UUIDv4_RX.test(x)

export const keysOf: T._KeysOfFn = o => {
	return Object.keys(o) as any
}

export const noop = () => {}
export const extend =
	<T extends Record<string, unknown>, N extends Record<string, unknown>>(f: (obj: T) => N) =>
	(obj: T) => ({ ...obj, ...f(obj) })

export const callOnce = <T extends any[], R>(fn: (...args: T) => R) => {
	let wasCalled = false

	return (...args: T): R => {
		if (wasCalled) return void 0 as unknown as R

		const result = fn(...args)

		wasCalled = true

		return result
	}
}

export const getPercentage = (total: number, current: number): number =>
	Math.trunc((current / total) * 100)
