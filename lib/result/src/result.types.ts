// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { TOption } from "@ordo-pink/option"
import type { TSwitch } from "@ordo-pink/switch"

export type TMatchResultFn = <$TOk, $TErr>(
	result: TResult<$TOk, $TErr>,
) => TSwitch<$TOk | $TErr, []>

type ArrayToUnion<$T> = $T extends Array<infer U> ? U : $T
type RecordToUnion<$T extends Record<string, unknown>> = { [P in keyof $T]: $T[P] }[keyof $T]

export type DoubtfulButOkay<$T> = $T extends object & {
	pipe(f: infer F): any
}
	? F extends (x: TResult<infer V, infer _>) => any
		? V
		: never
	: $T

export type ErrWhat<$T> = $T extends object & {
	pipe(f: infer F): any
}
	? F extends (x: TResult<infer _, infer V>) => any
		? ErrWhat<V>
		: never
	: never

export type TOkResultConstructorFn = <$TOk, $TErr = never>(ok: $TOk) => TResult<$TOk, $TErr>

export type TErrResultConstructorFn = <$TErr, $TOk = never>(err: $TErr) => TResult<$TOk, $TErr>

export type TFromOptionConstructorFn = <$TOk, $TErr = void>(
	option: TOption<$TOk>,
	on_none?: () => $TErr,
) => TResult<$TOk, $TErr>

export type TMergeResultConstructorFn = <
	TSomeThings extends readonly unknown[] | [] | Record<string, unknown>,
>(
	results: TSomeThings,
) => TResult<
	TSomeThings extends []
		? { -readonly [P in keyof TSomeThings]: DoubtfulButOkay<TSomeThings[P]> }
		: { [P in keyof TSomeThings]: DoubtfulButOkay<TSomeThings[P]> },
	TSomeThings extends Array<any>
		? ArrayToUnion<{ -readonly [P in keyof TSomeThings]: ErrWhat<TSomeThings[P]> }>
		: RecordToUnion<{ [P in keyof TSomeThings]: ErrWhat<TSomeThings[P]> }>
>

export type TTryResultConstructorFn = <$TOk, $TErr = unknown>(
	trier: () => $TOk,
	catcher?: (error: unknown) => $TErr,
) => TResult<$TOk, $TErr>

export type TFromNullableResultConstructorFn = <$TOk, $TErr = null>(
	x?: $TOk | null,
	on_null?: () => $TErr,
) => TResult<NonNullable<$TOk>, $TErr>

export type TIfResultConstructorFn = <$TOk = undefined, $TErr = undefined>(
	predicate: boolean,
	returns?: { T?: () => $TOk; F?: () => $TErr },
) => TResult<$TOk, $TErr>

export type TMapResultOperatorFn = <$TOk, $TErr, $TNewOk>(
	on_ok: (x: $TOk) => $TNewOk,
) => (result: TResult<$TOk, $TErr>) => TResult<$TNewOk, $TErr>

export type TErrMapResultOperatorFn = <$TOk, $TErr, $TNewRrr>(
	on_err: (x: $TErr) => $TNewRrr,
) => (result: TResult<$TOk, $TErr>) => TResult<$TOk, $TNewRrr>

export type TBiMapResultOperatorFn = <$TOk, $TErr, $TNewOk, $TNewRrr>(
	on_err: (x: $TErr) => $TNewRrr,
	on_ok: (x: $TOk) => $TNewOk,
) => (result: TResult<$TOk, $TErr>) => TResult<$TNewOk, $TNewRrr>

export type TChainResultOperatorFn = <$TOk, $TErr, $TNewOk, $TNewRrr>(
	on_ok: (x: $TOk) => TResult<$TNewOk, $TNewRrr>,
) => (result: TResult<$TOk, $TErr>) => TResult<$TNewOk, $TErr | $TNewRrr>

export type TErrChainResultOperatorFn = <$TOk, $TErr, $TNewOk, $TNewRrr>(
	on_err: (x: $TErr) => TResult<$TNewOk, $TNewRrr>,
) => (result: TResult<$TOk, $TErr>) => TResult<$TOk, $TNewRrr>

export type TBiChainResultOperatorFn = <$TOk, $TErr, $TNewOk, $TNewRrr>(
	on_err: (x: $TErr) => TResult<$TNewOk, $TNewRrr>,
	on_ok: (x: $TOk) => TResult<$TNewOk, $TNewRrr>,
) => (result: TResult<$TOk, $TErr>) => TResult<$TNewOk, $TNewRrr>

export type TTapResultOperatorFn = <$TOk, $TErr>(
	on_ok: (x: $TOk) => any,
) => (result: TResult<$TOk, $TErr>) => TResult<$TOk, $TErr>

export type TErrTapResultOperatorFn = <$TOk, $TErr>(
	on_err: (x: $TErr) => any,
) => (result: TResult<$TOk, $TErr>) => TResult<$TOk, $TErr>

export type TBiTapResultOperatorFn = <$TOk, $TErr>(
	on_err: (x: $TErr) => any,
	on_ok: (x: $TOk) => any,
) => (result: TResult<$TOk, $TErr>) => TResult<$TOk, $TErr>

export type TSwapResultOperatorFn = <$TOk, $TErr>() => (
	result: TResult<$TOk, $TErr>,
) => TResult<$TErr, $TOk>

export type TIsResultGuardFn<$TOk = unknown, $TErr = unknown> = (
	x: unknown,
) => x is TResult<$TOk, $TErr>

export type TIsOkGuardFn = <_TOk, _TErr>(x: TResult<_TOk, _TErr>) => x is TResult<_TOk, never>

export type TIsErrGuardFn = <_TOk, _TErr>(x: TResult<_TOk, _TErr>) => x is TResult<never, _TErr>

export type TOrElseCataFn = <_TOk, _TErr, _TNewErr>(
	on_err: (err: _TErr) => _TNewErr,
) => { Ok: (on_ok: _TOk) => _TOk; Err: (err: _TErr) => _TNewErr }

export type TIfOkCataFn = <_TOk, _TNewOk>(
	on_ok: (ok: _TOk) => _TNewOk,
) => { Ok: (on_ok: _TOk) => _TNewOk; Err: () => void }

export type TOrNothingCata = <_TOk>() => { Ok: (ok: _TOk) => _TOk; Err: () => undefined }

export type TResultStatic = {
	of: TOkResultConstructorFn
	Ok: TOkResultConstructorFn
	Err: TErrResultConstructorFn
	Try: TTryResultConstructorFn
	If: TIfResultConstructorFn
	FromNullable: TFromNullableResultConstructorFn
	FromOption: TFromOptionConstructorFn
	Merge: TMergeResultConstructorFn
	guards: {
		is_result: TIsResultGuardFn
		is_ok: TIsOkGuardFn
		is_err: TIsErrGuardFn
	}
	catas: {
		or_nothing: TOrNothingCata
		or_else: TOrElseCataFn
		if_ok: TIfOkCataFn
	}
	ops: {
		map: TMapResultOperatorFn
		err_map: TErrMapResultOperatorFn
		bimap: TBiMapResultOperatorFn
		chain: TChainResultOperatorFn
		err_chain: TErrChainResultOperatorFn
		bichain: TBiChainResultOperatorFn
		tap: TTapResultOperatorFn
		err_tap: TErrTapResultOperatorFn
		bitap: TBiTapResultOperatorFn
		swap: TSwapResultOperatorFn
	}
}

export type TUnwrapOk<$TResult> = $TResult extends TResult<infer _TOk, any> ? _TOk : never
export type TUnwrapErr<$TResult> = $TResult extends TResult<any, infer _TErr> ? _TErr : never

export type TResult<$TOk, $TErr> = {
	get is_ok(): boolean
	get is_err(): boolean
	get is_result(): true
	/**
	 * @deprecated UNSAFE. Use `result.cata` instead.
	 */
	unwrap: () => $TOk | $TErr
	pipe: <_TOk, _TErr>(
		operator: (result: TResult<$TOk, $TErr>) => TResult<_TOk, _TErr>,
	) => TResult<_TOk, _TErr>
	cata: <_TOk, _TErr>(explosion: {
		Ok: (ok: $TOk) => _TOk
		Err: (err: $TErr) => _TErr
	}) => _TOk | _TErr
}
