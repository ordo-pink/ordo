// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

export type UnderOath<T> = T extends object & {
	and(onResolved: infer F, ...args: infer _): any
}
	? F extends (value: infer V, ...args: infer _) => any
		? UnderOath<V>
		: never
	: Awaited<T>

export type UnderOathRejected<T> = T extends object & {
	fix(onRejected: infer F): any
}
	? F extends (value: infer V) => any
		? UnderOathRejected<V>
		: never
	: Awaited<T>
