/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 *
 */

// deno-lint-ignore-file no-explicit-any

/**
 * TUnderOath is an equivalent of Promise `Awaited` type that unwraps the resolving
 * value from the asynchronous box (a Promise or an Oath).
 */
export type TUnderOath<T> = T extends object & {
	and(on_resolve: infer F, ...args: infer _): any
}
	? F extends (value: infer V, ...args: infer _) => any
		? TUnderOath<V>
		: never
	: Awaited<T>

/**
 * TUnderOathRejected is like `TUnderOath` but instead of unwrapping the resolving
 * value, it unwraps the rejecting value from the asynchronous box (a Promise or an Oath).
 */
export type TUnderOathRejected<T> = T extends object & {
	fix(on_reject: infer F): any
}
	? F extends (value: infer V) => any
		? TUnderOathRejected<V>
		: never
	: never

/**
 * An "explosion" provided to the `Oath.If` as a second parameter to specify a value that
 * should be resolved or rejected.
 */
export type TOathIfExplosion<$TResolve, $TReject> = {
	/**
	 * A thunk of a value that should be resolved if `Oath.If` check is `true`.
	 *
	 * @default undefined
	 */
	T?: () => $TResolve

	/**
	 * A thunk of a value that should be rejected if `Oath.If` check is `false`.
	 *
	 * @default undefined
	 */
	F?: () => $TReject
}

/**
 * Transforms an array type into an intersection (` | `).
 */
export type TArrayToUnion<T> = T extends Array<infer U> ? U : T

/**
 * Transforms values of an object type into an intersection (` | `).
 */
export type TRecordToUnion<T extends Record<string, unknown>> = { [P in keyof T]: T[P] }[keyof T]
