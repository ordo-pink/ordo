// SPDX-FileCopyrightText: Copyright 2023, Sergei Orlov and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

// deno-lint-ignore-file no-explicit-any

import type * as T from "./types.ts"

export const isObject = (x: unknown): x is Record<string, unknown> =>
	x != null && typeof x === "object" && !Array.isArray(x)

export const isFunction = <T = unknown, K = T>(x: unknown): x is (x: T) => K =>
	typeof x == "function"

export const keysOf: T._KeysOfFn = o => {
	return Object.keys(o) as any
}

export const titleize: T._TitleizeFn = s => {
	const chars = s.split("")

	return chars[0]
		.toLocaleUpperCase()
		.concat(...chars.slice(1).map(char => char.toLocaleLowerCase())) as any
}
