// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

// deno-lint-ignore-file no-explicit-any

export type UnderOath<T> = T extends object & {
	and(on_resolve: infer F, ...args: infer _): any
}
	? F extends (value: infer V, ...args: infer _) => any
		? UnderOath<V>
		: never
	: Awaited<T>

export type UnderOathRejected<T> = T extends object & {
	fix(on_reject: infer F): any
}
	? F extends (value: infer V) => any
		? UnderOathRejected<V>
		: never
	: never

export type TOathStatic = {
	Resolve: <$TResolve, $TReject = never>(value: $TResolve) => TOath<$TResolve, $TReject>
	Reject: <$TReject, $TResolve = never>(value: $TReject) => TOath<$TResolve, $TReject>
	FromNullable: () => void
	FromPromise: () => void
	ops: {
		map: () => void
		rejected_map: () => void
		bimap: () => void
		chain: () => void
		rejected_chain: () => void
		bichain: () => void
		tap: () => void
		rejected_tap: () => void
		bitap: () => void
		await: () => void
		concat: () => void
	}
}

export type TOath<$TResolve, $TReject> = {
	get is_oath(): true
	get is_resolve(): boolean
	get is_reject(): boolean
	get is_cancelled(): boolean
	get cancellation_reason(): string | undefined

	cancel: (reason?: string) => void

	pipe: <_TNewResolve, _TNewReject>(
		operator: (oath: TOath<$TResolve, $TReject>) => TOath<_TNewResolve, _TNewReject>,
	) => TOath<_TNewResolve, _TNewReject>

	cata: <_TNewResolve, _TNewReject>(explosion: {
		Resolve: (value: $TResolve) => _TNewResolve
		Reject: (value: $TReject) => _TNewReject
	}) => _TNewResolve | _TNewReject

	unwrap: () => $TResolve | $TReject
}
