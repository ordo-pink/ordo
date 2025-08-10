/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export namespace Oath {
	export type CancellationReason = string & NonNullable<unknown>

	export namespace Ops {
		export type Static = {
			and: Oath.Ops.And
			ap: Oath.Ops.Ap
			bimap: Oath.Ops.BiMap
			chain: Oath.Ops.Chain
			fix: Oath.Ops.Fix
			map: Oath.Ops.Map
			rmap: Oath.Ops.RMap
			rtap: Oath.Ops.RTap
			tap: Oath.Ops.Tap
		}

		// TODO Infer _NewReject
		export type Fix = <_Resolve, _Reject, _NewResolve>(
			f: (x: _Reject) => _NewResolve,
		) => (
			o: Oath.Instance<_Resolve, _Reject>,
		) => _NewResolve extends PromiseLike<infer _Resolved>
			? Instance<_Resolved, _Reject>
			: _NewResolve extends Instance<infer _Resolve, infer __NewReject>
				? Instance<_Resolve, __NewReject>
				: Instance<_Resolve | _NewResolve, never>

		export type And = <_Resolve, _Reject, _NewResolve, _NewReject>(
			f: (x: _Resolve) => _NewResolve,
			on_rejected?: (x: _Reject) => _NewReject,
		) => (
			o: Oath.Instance<_Resolve, _Reject>,
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
			f: (x: _Resolve) => Oath.Instance<_NewResolve, _NewReject>,
		) => (o: Oath.Instance<_Resolve, _Reject>) => Oath.Instance<_NewResolve, _Reject | _NewReject>

		export type Tap = <_Resolve, _Reject>(
			f: (x: _Resolve) => any,
			on_rejected?: (x: _Reject) => any,
		) => (o: Oath.Instance<_Resolve, _Reject>) => Oath.Instance<_Resolve, _Reject>

		export type RTap = <_Resolve, _Reject>(
			f: (x: _Reject) => any,
			on_resolved?: (x: _Resolve) => any,
		) => (o: Oath.Instance<_Resolve, _Reject>) => Oath.Instance<_Resolve, _Reject>

		export type Map = <_Resolve, _Reject, _NewResolve>(
			f: (x: _Resolve) => _NewResolve,
		) => (o: Oath.Instance<_Resolve, _Reject>) => Oath.Instance<_NewResolve, _Reject>

		export type RMap = <_Resolve, _Reject, _NewReject>(
			f: (x: _Reject) => _NewReject,
		) => (o: Oath.Instance<_Resolve, _Reject>) => Oath.Instance<_Resolve, _NewReject>

		export type BiMap = <_Resolve, _Reject, _NewResolve, _NewReject>(
			on_resolved: (x: _Resolve) => _NewResolve,
			on_rejected: (x: _Reject) => _NewReject,
		) => (o: Oath.Instance<_Resolve, _Reject>) => Oath.Instance<_NewResolve, _NewReject>

		export type Ap = <_Resolve, _Reject>(
			x: Oath.Instance<_Resolve, _Reject>,
		) => <_NewResolve, _NewReject>(
			o: Oath.Instance<(x: _Resolve) => _NewResolve, _NewReject>,
		) => Oath.Instance<_NewResolve, _Reject | _NewReject>
	}

	export namespace Constructors {
		export type Static = {
			all: Oath.Constructors.All
			any: Oath.Constructors.Any
			empty: Oath.Constructors.Empty
			from_nullable: Oath.Constructors.FromNullable
			from_promise: Oath.Constructors.FromPromise
			if: Oath.Constructors.If
			merge: Oath.Constructors.Merge
			new: Oath.Constructors.Create
			reject: Oath.Constructors.Reject
			resolve: Oath.Constructors.Resolve
			of: Oath.Constructors.Resolve
			try: Oath.Constructors.Try
		}

		export type Empty = () => Oath.Instance<void>

		export type Resolve = <_Resolve, _Reject = never>(x: _Resolve) => Oath.Instance<_Resolve, _Reject>

		export type Reject = <_Reject, _Resolve = never>(x: _Reject) => Oath.Instance<_Resolve, _Reject>

		export type FromPromise = <$Resolve, $Reject = unknown>(p: () => Promise<$Resolve>) => Oath.Instance<$Resolve, $Reject>

		export type FromNullable = <$Nullable, _OnNull = null>(
			x: $Nullable | null | undefined,
			on_null?: () => _OnNull,
		) => Oath.Instance<NonNullable<$Nullable>, _OnNull>

		export type If = <$OnTrue = void, $OnFalse = void>(
			condition: boolean,
			branches?: { on_true?: () => $OnTrue; on_false?: () => $OnFalse },
		) => Oath.Instance<$OnTrue, $OnFalse>

		export type Merge = <$Values extends Record<string, unknown>>(
			values: $Values,
		) => Oath.Instance<
			{ [P in keyof $Values]: UnderOath<$Values[P]> },
			Oath.RecordToUnion<{ [P in keyof $Values]: UnderOathRejected<$Values[P]> }>
		>

		export type All = <$Values extends readonly unknown[] | []>(
			values: $Values,
		) => Oath.Instance<
			{ -readonly [P in keyof $Values]: UnderOath<$Values[P]> },
			Oath.ArrayToUnion<{ -readonly [P in keyof $Values]: UnderOathRejected<$Values[P]> }>
		>

		export type Any = <$Values extends readonly unknown[] | []>(
			values: $Values,
		) => Oath.Instance<
			Oath.ArrayToUnion<{ -readonly [P in keyof $Values]: UnderOath<$Values[P]> }>,
			{ -readonly [P in keyof $Values]: UnderOathRejected<$Values[P]> }
		>

		export type Try = <$Resolve, $Reject = unknown, _NewReject = $Reject>(
			trier: () => $Resolve,
			catcher?: (e: $Reject) => _NewReject,
		) => Oath.Instance<$Resolve, _NewReject>

		export type Create = <_Resolve, _Reject>(
			fork: (resolve: (resolved: _Resolve) => any, reject: (rejected: _Reject) => any) => any,
			cancellation_reason?: CancellationReason,
		) => Oath.Instance<_Resolve, _Reject>
	}

	export namespace Methods {
		export type Cata<$Resolve, $Reject> = <_NewResolve, _NewReject>(boom: {
			resolve: (resolved: $Resolve) => _NewResolve
			reject: (rejected: $Reject) => _NewReject
		}) => typeof boom extends undefined ? Promise<_NewResolve> : Promise<_NewResolve | _NewReject>

		export type Pipe<$Resolve, $Reject> = <_NewResolve, _NewReject>(
			op: (o: Oath.Instance<$Resolve, $Reject>) => Oath.Instance<_NewResolve, _NewReject>,
		) => Oath.Instance<_NewResolve, _NewReject>

		export type Cancel = (reason: CancellationReason) => void
	}

	export namespace Catas {
		export type Static = {
			if_ok: Oath.Catas.IfOk
			noop: Oath.Catas.Noop
			unwrap: Oath.Catas.Unwrap
			or_else: Oath.Catas.OrElse
			to_promise: Oath.Catas.ToPromise
		}

		export type ToPromise = <_Resolve>() => {
			resolve: (x: _Resolve) => _Resolve
		}

		export type Noop = () => { resolve: () => void; reject: () => void }

		export type Unwrap = <_Resolve, _Reject>() => { resolve: (x: _Resolve) => _Resolve; reject: (x: _Reject) => _Reject }

		export type OrElse = <_Resolve, _Reject, _NewResolve>(
			f: (reject: _Reject) => _NewResolve,
		) => {
			resolve: (x: _Resolve) => _Resolve
			reject: (reject: _Reject) => _NewResolve
		}

		export type IfOk = <_Resolve, _NewResolve>(
			f: (resolve: _Resolve) => _NewResolve,
		) => {
			resolve: (resolve: _Resolve) => _NewResolve
			reject: () => void
		}
	}

	export type Instance<$Resolve, $Reject = never> = {
		get is_cancelled(): boolean
		get is_oath(): true
		get reason(): Oath.CancellationReason | undefined

		cancel: Oath.Methods.Cancel
		cata: Oath.Methods.Cata<$Resolve, $Reject>
		pipe: Oath.Methods.Pipe<$Resolve, $Reject>
	}

	export type Static = Oath.Constructors.Static & {
		catas: Oath.Catas.Static
		ops: Oath.Ops.Static
	}

	/**
	 * TUnderOath is an equivalent of Promise `Awaited` type that unwraps the resolving
	 * value from the asynchronous box (a Promise or an Oath).
	 */
	export type UnderOath<$X> = $X extends object & {
		cata: (boom: infer __Boom) => any
	}
		? __Boom extends { resolve: (value: infer __Resolved, ...args: infer _) => any }
			? UnderOath<__Resolved>
			: never
		: Awaited<$X>

	/**
	 * TUnderOathRejected is like `TUnderOath` but instead of unwrapping the resolving
	 * value, it unwraps the rejecting value from the asynchronous box (a Promise or an Oath).
	 */
	export type UnderOathRejected<$X> = $X extends object & {
		cata: (boom: infer __Boom) => any
	}
		? __Boom extends { reject: (x: infer __Rejected) => any }
			? __Rejected
			: 1
		: $X extends object & { then: (...args: any[]) => any }
			? unknown
			: 2

	/**
	 * Transforms an array type into an intersection (` | `).
	 */
	export type ArrayToUnion<T> = T extends Array<infer U> ? U : T

	/**
	 * Transforms values of an object type into an intersection (` | `).
	 */
	export type RecordToUnion<T extends Record<string, unknown>> = { [P in keyof T]: T[P] }[keyof T]
}
