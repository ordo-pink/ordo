// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import type { TSwitch } from "@ordo-pink/switch"

export type TMatchResultFn = <_TOk, __TRrr>(
	result: TResult<_TOk, __TRrr>,
) => TSwitch<_TOk | __TRrr, []>

export type TOkResultConstructorFn = <_TOk, _TRrr = never>(x: _TOk) => TResult<_TOk, _TRrr>

export type TRrrResultConstructorFn = <_TRrr, _TOk = never>(x: _TRrr) => TResult<_TOk, _TRrr>

export type TTryResultConstructorFn = <_TOk, _TRrr = unknown>(
	trier: () => _TOk,
	catcher?: (error: unknown) => _TRrr,
) => TResult<_TOk, _TRrr>

export type TFromNullableResultConstructorFn = <_TOk, _TRrr = null>(
	x?: _TOk | null,
	onNull?: () => _TRrr,
) => TResult<NonNullable<_TOk>, _TRrr>

export type TIfResultConstructorFn = <_TOk = undefined, _TRrr = undefined>(
	predicate: boolean,
	returns?: { onT?: () => _TOk; onF?: () => _TRrr },
) => TResult<_TOk, _TRrr>

export type TMapResultOperatorFn = <_TOk, _TRrr, _TNewOk>(
	onOk: (x: _TOk) => _TNewOk,
) => (result: TResult<_TOk, _TRrr>) => TResult<_TNewOk, _TRrr>

export type TRrrMapResultOperatorFn = <_TOk, _TRrr, _TNewRrr>(
	onRrr: (x: _TRrr) => _TNewRrr,
) => (result: TResult<_TOk, _TRrr>) => TResult<_TOk, _TNewRrr>

export type TBiMapResultOperatorFn = <_TOk, _TRrr, _TNewOk, _TNewRrr>(
	onRrr: (x: _TRrr) => _TNewRrr,
	onOk: (x: _TOk) => _TNewOk,
) => (result: TResult<_TOk, _TRrr>) => TResult<_TNewOk, _TNewRrr>

export type TChainResultOperatorFn = <_TOk, _TRrr, _TNewOk, _TNewRrr>(
	onOk: (x: _TOk) => TResult<_TNewOk, _TNewRrr>,
) => (result: TResult<_TOk, _TRrr>) => TResult<_TNewOk, _TRrr | _TNewRrr>

export type TRrrChainResultOperatorFn = <_TOk, _TRrr, _TNewOk, _TNewRrr>(
	onRrr: (x: _TRrr) => TResult<_TNewOk, _TNewRrr>,
) => (result: TResult<_TOk, _TRrr>) => TResult<_TOk, _TNewRrr>

export type TBiChainResultOperatorFn = <_TOk, _TRrr, _TNewOk, _TNewRrr>(
	onRrr: (x: _TRrr) => TResult<_TNewOk, _TNewRrr>,
	onOk: (x: _TOk) => TResult<_TNewOk, _TNewRrr>,
) => (result: TResult<_TOk, _TRrr>) => TResult<_TNewOk, _TNewRrr>

export type TTapResultOperatorFn = <_TOk, _TRrr>(
	onOk: (x: _TOk) => any,
) => (result: TResult<_TOk, _TRrr>) => TResult<_TOk, _TRrr>

export type TRrrTapResultOperatorFn = <_TOk, _TRrr>(
	onRrr: (x: _TRrr) => any,
) => (result: TResult<_TOk, _TRrr>) => TResult<_TOk, _TRrr>

export type TBiTapResultOperatorFn = <_TOk, _TRrr>(
	onRrr: (x: _TRrr) => any,
	onOk: (x: _TOk) => any,
) => (result: TResult<_TOk, _TRrr>) => TResult<_TOk, _TRrr>

export type TSwapResultOperatorFn = <_TOk, _TRrr>() => (
	result: TResult<_TOk, _TRrr>,
) => TResult<_TRrr, _TOk>

export type TResultStatic = {
	ok: TOkResultConstructorFn
	rrr: TRrrResultConstructorFn
	try: TTryResultConstructorFn
	if: TIfResultConstructorFn
	fromNullable: TFromNullableResultConstructorFn
	ops: {
		map: TMapResultOperatorFn
		rrrMap: TRrrMapResultOperatorFn
		bimap: TBiMapResultOperatorFn
		chain: TChainResultOperatorFn
		rrrChain: TRrrChainResultOperatorFn
		bichain: TBiChainResultOperatorFn
		tap: TTapResultOperatorFn
		rrrTap: TRrrTapResultOperatorFn
		bitap: TBiTapResultOperatorFn
		swap: TSwapResultOperatorFn
	}
}

export type TResult<_TOk, _TRrr> = {
	isOk: boolean
	isRrr: boolean
	isResult: boolean
	/**
	 * @deprecated UNSAFE. Use `result.match` or `match(result)` instead.
	 */
	unwrap: () => _TOk | _TRrr
	pipe: <_TOk_, _TRrr_>(
		operator: (result: TResult<_TOk, _TRrr>) => TResult<_TOk_, _TRrr_>,
	) => TResult<_TOk_, _TRrr_>
	cata: <_TOk_, _TRrr_>(explosion: {
		ok: (ok: _TOk) => _TOk_
		rrr: (rrr: _TRrr) => _TRrr_
	}) => _TOk_ | _TRrr_
}
