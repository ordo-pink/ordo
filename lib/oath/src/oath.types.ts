/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

// deno-lint-ignore-file no-explicit-any

export namespace Oath {
	export type CancellationReason = string & NonNullable<unknown>

	export namespace Operators {
		export type Static = {
			and: Oath.Operators.And
			ap: Oath.Operators.Ap
			bimap: Oath.Operators.BiMap
			chain: Oath.Operators.Chain
			fix: Oath.Operators.Fix
			map: Oath.Operators.Map
			rejected_map: Oath.Operators.RejectedMap
			rejected_tap: Oath.Operators.RejectedTap
			tap: Oath.Operators.Tap
		}

		// TODO Infer _NewReject
		export type Fix = <_Resolve, _Reject, _NewResolve>(
			on_reject: (rejected: _Reject) => _NewResolve,
		) => (
			o: Oath.Instance<_Resolve, _Reject>,
		) => _NewResolve extends PromiseLike<infer _Resolved>
			? Instance<_Resolved, _Reject, true>
			: _NewResolve extends Instance<infer _Resolve, infer __NewReject>
				? Instance<_Resolve, __NewReject>
				: Instance<_Resolve | _NewResolve, never>

		export type And = <_Resolve, _Reject, _NewResolve, _NewReject>(
			on_resolve: (resolved: _Resolve) => _NewResolve,
			on_reject?: (rejected: _Reject) => _NewReject,
		) => (
			o: Oath.Instance<_Resolve, _Reject>,
		) => typeof on_reject extends (x: _Reject) => _NewReject
			? _NewResolve extends PromiseLike<infer _Resolved>
				? Instance<_Resolved, _NewReject, true>
				: _NewResolve extends Instance<infer _Resolve, infer _Reject>
					? Instance<_Resolve, _NewReject | _Reject>
					: Instance<_NewResolve, _NewReject>
			: _NewResolve extends PromiseLike<infer _Resolved>
				? Instance<_Resolved, _Reject, true>
				: _NewResolve extends Instance<infer _Resolve, infer U>
					? Instance<_Resolve, _Reject | U>
					: Instance<_NewResolve, _Reject>

		export type Chain = <_Resolve, _Reject, _Async extends boolean, _NewResolve, _NewReject, _NewAsync extends boolean>(
			on_resolved: (x: _Resolve) => Oath.Instance<_NewResolve, _NewReject, _NewAsync>,
		) => (
			o: Oath.Instance<_Resolve, _Reject, _Async>,
		) => _Async extends true
			? Oath.Instance<_NewResolve, _Reject | _NewReject, true>
			: _NewAsync extends true
				? Oath.Instance<_NewResolve, _Reject | _NewReject, true>
				: Oath.Instance<_NewResolve, _Reject | _NewReject, false>

		export type Tap = <$Resolve, $Reject>(
			on_resolved: (x: $Resolve) => any,
			on_rejected?: (x: $Reject) => any,
		) => (o: Oath.Instance<$Resolve, $Reject>) => Oath.Instance<$Resolve, $Reject>

		export type RejectedTap = <_Resolve, _Reject>(
			on_rejected: (x: _Reject) => any,
			on_resolved?: (x: _Resolve) => any,
		) => (o: Oath.Instance<_Resolve, _Reject>) => Oath.Instance<_Resolve, _Reject>

		export type Map = <_Resolve, _Reject, _NewResolve>(
			on_resolved: (x: _Resolve) => _NewResolve,
		) => (o: Oath.Instance<_Resolve, _Reject>) => Oath.Instance<_NewResolve, _Reject>

		export type RejectedMap = <_Resolve, _Reject, _NewReject>(
			on_rejected: (x: _Reject) => _NewReject,
		) => (o: Oath.Instance<_Resolve, _Reject>) => Oath.Instance<_Resolve, _NewReject>

		export type BiMap = <_Resolve, _Reject, _NewResolve, _NewReject>(
			on_resolved: (x: _Resolve) => _NewResolve,
			on_rejected: (x: _Reject) => _NewReject,
		) => (o: Oath.Instance<_Resolve, _Reject>) => Oath.Instance<_NewResolve, _NewReject>

		export type Ap = <_Resolve>(
			resolve: Oath.Instance<_Resolve, never>,
		) => <_NewResolve, _Reject>(o: Oath.Instance<(x: _Resolve) => _NewResolve, _Reject>) => Oath.Instance<_NewResolve, _Reject>
	}

	export namespace Constructors {
		export type Static = {
			all: Oath.Constructors.All
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

		export type FromPromise = <$Resolve, $Reject = unknown>(
			p: () => Promise<$Resolve>,
		) => Oath.Instance<$Resolve, $Reject, true>

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
			{ [P in keyof $Values]: TUnderOath<$Values[P]> },
			TRecordToUnion<{ [P in keyof $Values]: TUnderOathRejected<$Values[P]> }>
		>

		export type All = <$Values extends readonly unknown[] | []>(
			values: $Values,
		) => Oath.Instance<
			{ -readonly [P in keyof $Values]: TUnderOath<$Values[P]> },
			TArrayToUnion<{ -readonly [P in keyof $Values]: TUnderOathRejected<$Values[P]> }>
		>

		export type Try = <$Resolve, $Reject = unknown, _NewReject = $Reject>(
			trier: () => $Resolve,
			catcher?: (e: $Reject) => _NewReject,
		) => Oath.Instance<$Resolve, _NewReject>

		export type Create = <_Resolve, _Reject>(
			fork: (resolve: (resolved: _Resolve) => _Resolve, reject: (rejected: _Reject) => _Reject) => any,
			cancellation_reason?: CancellationReason,
		) => Oath.Instance<_Resolve, _Reject>
	}

	export namespace Methods {
		export type Fork<$Resolve, $Reject> = <_NewResolve, _NewReject>(
			on_resolve: (x: $Resolve) => _NewResolve,
			on_reject: (x: $Reject | Oath.CancellationReason) => _NewReject | Oath.CancellationReason,
		) => Promise<_NewResolve>

		export type Cata<$Resolve, $Reject, $Async extends boolean> = <_NewResolve, _NewReject>(explosion: {
			resolve: (resolved: $Resolve) => _NewResolve
			reject: (rejected: $Reject) => _NewReject
		}) => $Async extends true ? Promise<Awaited<_NewResolve | _NewReject>> : _NewResolve | _NewReject

		export type Pipe<$Resolve, $Reject, $Async extends boolean> = <_NewResolve, _NewReject, _NewAsync extends boolean>(
			operator: (o: Oath.Instance<$Resolve, $Reject, $Async>) => Oath.Instance<_NewResolve, _NewReject, _NewAsync>,
		) => $Async extends true
			? Oath.Instance<_NewResolve, _NewReject, true>
			: _NewAsync extends true
				? Oath.Instance<_NewResolve, _NewReject, true>
				: Oath.Instance<_NewResolve, _NewReject, false>

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

		export type ToPromise = <_Resolve, _Reject>(
			on_reject?: (x: _Reject) => any,
		) => {
			resolve: (x: _Resolve) => Promise<Awaited<_Resolve>>
			reject: (
				x: _Reject,
			) => typeof on_reject extends (x: _Reject) => infer _NewResolve
				? Promise<Awaited<_Resolve | _NewResolve>>
				: Promise<Awaited<_Resolve>>
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

	export type Instance<$Resolve, $Reject = never, $Async extends boolean = false> = {
		get is_cancelled(): boolean
		get is_oath(): true
		get reason(): Oath.CancellationReason | undefined

		// and: O.Methods.And<$Resolve, $Reject>
		cancel: Oath.Methods.Cancel
		cata: Oath.Methods.Cata<$Resolve, $Reject, $Async>
		// fix: O.Methods.Fix<$Resolve, $Reject>
		// fork: O.Methods.Fork<$Resolve, $Reject>
		pipe: Oath.Methods.Pipe<$Resolve, $Reject, $Async>
	}

	export type Static = Oath.Constructors.Static & {
		catas: Oath.Catas.Static
		ops: Oath.Operators.Static
	}
}

/**
 * TUnderOath is an equivalent of Promise `Awaited` type that unwraps the resolving
 * value from the asynchronous box (a Promise or an Oath).
 */
export type TUnderOath<T> = T extends object & {
	cata: (explosion: infer F) => any
}
	? F extends { resolve: (value: infer V, ...args: infer _) => any }
		? TUnderOath<V>
		: never
	: Awaited<T>

// type TUnderOath<T> = T extends Oath.Instance<infer __Resolve, any, any> ? TUnderOath<__Resolve> : Awaited<T>

/**
 * TUnderOathRejected is like `TUnderOath` but instead of unwrapping the resolving
 * value, it unwraps the rejecting value from the asynchronous box (a Promise or an Oath).
 */
export type TUnderOathRejected<T> = T extends object & {
	fix(on_reject: infer F): any
}
	? F extends (value: infer V) => any
		? V
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
