/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import * as lib from "./src/oath.impl"

if (!globalThis.oath) globalThis.oath = lib

declare global {
	var oath: typeof lib

	export namespace Oath {
		export type CancellationReason = string & NonNullable<unknown>

		export type Fix = <_Resolve, _Reject, _NewResolve>(
			on_rejected: (x: _Reject) => _NewResolve,
		) => (
			o: Instance<_Resolve, _Reject>,
		) => _NewResolve extends PromiseLike<infer _Resolved>
			? Instance<_Resolved, _Reject>
			: _NewResolve extends Instance<infer _Resolve, infer __NewReject>
				? Instance<_Resolve, __NewReject>
				: Instance<_Resolve | _NewResolve, never>

		export type And = <_Resolve, _Reject, _NewResolve, _NewReject>(
			on_resolved: (x: _Resolve) => _NewResolve,
			on_rejected?: (x: _Reject) => _NewReject,
		) => (
			o: Instance<_Resolve, _Reject>,
		) => typeof on_rejected extends (x: _Reject) => _NewReject
			? _NewResolve extends PromiseLike<infer _Resolved>
				? Instance<_Resolved, _NewReject>
				: _NewResolve extends Instance<infer _Resolve, infer _Reject>
					? Instance<_Resolve, _NewReject | _Reject>
					: Instance<_NewResolve, _NewReject>
			: _NewResolve extends PromiseLike<infer _Resolved>
				? Instance<_Resolved, _Reject>
				: _NewResolve extends Instance<infer _Resolve, infer U>
					? Instance<_Resolve, _Reject | U>
					: Instance<_NewResolve, _Reject>

		export type Chain = <_Resolve, _Reject, _NewResolve, _NewReject>(
			on_resolved: (x: _Resolve) => Instance<_NewResolve, _NewReject>,
		) => (o: Instance<_Resolve, _Reject>) => Instance<_NewResolve, _Reject | _NewReject>

		export type RChain = <_Resolve, _Reject, _NewResolve, _NewReject>(
			on_rejected: (x: _Reject) => Instance<_NewResolve, _NewReject>,
		) => (o: Instance<_Resolve, _Reject>) => Instance<_Resolve | _NewResolve, _NewReject>

		export type Tap = <_Resolve, _Reject>(
			on_resolved: (x: _Resolve) => any,
			on_rejected?: (x: _Reject) => any,
		) => (o: Instance<_Resolve, _Reject>) => Instance<_Resolve, _Reject>

		export type RTap = <_Resolve, _Reject>(
			on_rejected: (x: _Reject) => any,
			on_resolved?: (x: _Resolve) => any,
		) => (o: Instance<_Resolve, _Reject>) => Instance<_Resolve, _Reject>

		export type Map = <const _Resolve, const _Reject, const _NewResolve>(
			on_resolved: (x: _Resolve) => _NewResolve,
		) => (o: Instance<_Resolve, _Reject>) => Instance<_NewResolve, _Reject>

		export type RMap = <_Resolve, _Reject, _NewReject>(
			on_rejected: (x: _Reject) => _NewReject,
		) => (o: Instance<_Resolve, _Reject>) => Instance<_Resolve, _NewReject>

		export type Swap = <_Resolve, _Reject>(o: Instance<_Resolve, _Reject>) => Instance<_Reject, _Resolve>

		export type BiMap = <_Resolve, _Reject, _NewResolve, _NewReject>(
			on_resolved: (x: _Resolve) => _NewResolve,
			on_rejected: (x: _Reject) => _NewReject,
		) => (o: Instance<_Resolve, _Reject>) => Instance<_NewResolve, _NewReject>

		export type Ap = <_Resolve, _Reject>(
			x: Instance<_Resolve, _Reject>,
		) => <_NewResolve, _NewReject>(
			o: Instance<(x: _Resolve) => _NewResolve, _NewReject>,
		) => Instance<_NewResolve, _Reject | _NewReject>

		export type Empty = () => Instance<void>

		export type Resolve = <_Resolve, _Reject = never>(x: _Resolve) => Instance<_Resolve, _Reject>

		export type Reject = <_Reject, _Resolve = never>(x: _Reject) => Instance<_Resolve, _Reject>

		export type FromPromise = <$Resolve, $Reject = unknown>(p: () => Promise<$Resolve>) => Instance<$Resolve, $Reject>

		export type FromNullable = <$Nullable, _OnNull = null>(
			x: $Nullable | null | undefined,
			on_null?: () => _OnNull,
		) => Instance<NonNullable<$Nullable>, _OnNull>

		export type If = <$OnTrue = void, $OnFalse = void>(
			condition: boolean,
			branches?: { t?: () => $OnTrue; f?: () => $OnFalse },
		) => Instance<$OnTrue, $OnFalse>

		export type Merge = <$Values extends Record<string, unknown>>(
			values: $Values,
		) => Instance<
			{ [P in keyof $Values]: UnderOath<$Values[P]> },
			RecordToUnion<{ [P in keyof $Values]: UnderOathRejected<$Values[P]> }>
		>

		export type All = <$Values extends readonly unknown[] | []>(
			values: $Values,
		) => Instance<
			{ -readonly [P in keyof $Values]: UnderOath<$Values[P]> },
			ArrayToUnion<{ -readonly [P in keyof $Values]: UnderOathRejected<$Values[P]> }>
		>

		export type Any = <$Values extends readonly unknown[] | []>(
			values: $Values,
		) => Instance<
			ArrayToUnion<{ -readonly [P in keyof $Values]: UnderOath<$Values[P]> }>,
			{ -readonly [P in keyof $Values]: UnderOathRejected<$Values[P]> }
		>

		export type Try = <$Resolve, $Reject = unknown, _NewReject = $Reject>(
			trier: () => $Resolve,
			catcher?: (e: $Reject) => _NewReject,
		) => Instance<$Resolve, _NewReject>

		export type Create = <_Resolve, _Reject>(
			fork: (resolve: (resolved: _Resolve) => any, reject: (rejected: _Reject) => any) => any,
			cancellation_reason?: CancellationReason,
		) => Instance<_Resolve, _Reject>

		export type Cata<$Resolve, $Reject> = <_NewResolve, _NewReject>(boom: {
			resolve: (resolved: $Resolve) => _NewResolve
			reject: (rejected: $Reject) => _NewReject
		}) => typeof boom extends undefined ? Promise<_NewResolve> : Promise<_NewResolve | _NewReject>

		export type Pipe<$Resolve, $Reject> = <const _NewResolve, const _NewReject>(
			op: (o: Instance<$Resolve, $Reject>) => Instance<_NewResolve, _NewReject>,
		) => Instance<_NewResolve, _NewReject>

		export type Cancel = (reason: CancellationReason) => void

		export type ToPromise = <_Resolve, _Reject>() => { resolve: (x: _Resolve) => _Resolve; reject: (x: _Reject) => never }

		export type Unwrap = <_Resolve, _Reject>() => { resolve: (x: _Resolve) => _Resolve; reject: (x: _Reject) => _Reject }

		export type Noop = () => { resolve: () => void; reject: () => void }

		export type OrElse = <_Resolve, _Reject, _NewResolve>(
			on_reject: (reject: _Reject) => _NewResolve,
		) => { resolve: (x: _Resolve) => _Resolve; reject: (reject: _Reject) => _NewResolve }

		export type IfOk = <_Resolve, _NewResolve>(
			on_resolve: (resolve: _Resolve) => _NewResolve,
		) => { resolve: (resolve: _Resolve) => _NewResolve; reject: () => void }

		export type Instance<$Resolve, $Reject = never> = {
			get is_cancelled(): boolean
			get is_oath(): true
			get reason(): CancellationReason | undefined

			cancel: Cancel
			cata: Cata<$Resolve, $Reject>
			pipe: Pipe<$Resolve, $Reject>
		}

		/**
		 * TUnderOath is an equivalent of Promise `Awaited` type that unwraps the resolving
		 * value from the asynchronous box (a Promise or an Oath).
		 */
		export type UnderOath<$X> = $X extends { cata: (boom: infer __Boom) => any }
			? __Boom extends { resolve: (value: infer __Resolved, ...args: infer _) => any }
				? UnderOath<__Resolved>
				: never
			: Awaited<$X>

		/**
		 * TUnderOathRejected is like `TUnderOath` but instead of unwrapping the resolving
		 * value, it unwraps the rejecting value from the asynchronous box (a Promise or an Oath).
		 */
		export type UnderOathRejected<$X> = $X extends { cata: (boom: infer __Boom) => any }
			? __Boom extends { reject: (x: infer __Rejected) => any }
				? __Rejected
				: never
			: $X extends { then: (...args: any[]) => any }
				? unknown
				: $X

		/**
		 * Transforms an array type into an intersection (` | `).
		 */
		export type ArrayToUnion<T> = T extends Array<infer U> ? U : T

		/**
		 * Transforms values of an object type into an intersection (` | `).
		 */
		export type RecordToUnion<T extends Record<string, unknown>> = { [P in keyof T]: T[P] }[keyof T]
	}
}
