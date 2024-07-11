// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import type * as Types from "./result.types"

export const ResultOk: Types.TOkResultConstructorFn = x => ({
	get is_ok() {
		return true
	},
	get is_err() {
		return false
	},
	get is_result() {
		return true as const
	},
	unwrap: () => x,
	pipe: f => f(ResultOk(x)),
	cata: e => e.Ok(x),
})

export const ResultErr: Types.TErrResultConstructorFn = x => ({
	get is_ok() {
		return false
	},
	get is_err() {
		return true
	},
	get is_result() {
		return true as const
	},
	unwrap: () => x,
	pipe: f => f(ResultErr(x)),
	cata: e => e.Err(x),
})

export const ResultTry: Types.TTryResultConstructorFn = (t, c = x => x as any) => {
	try {
		return ResultOk(t())
	} catch (e) {
		return ResultErr(c(e))
	}
}

export const ResultFromOption: Types.TFromOptionConstructorFn = (o, onNone = () => void 0 as any) =>
	o.cata({ Some: ResultOk, None: () => ResultErr(onNone()) })

export const ResultFromNullable: Types.TFromNullableResultConstructorFn = (
	x,
	onNull = () => null as any,
) => (x != null ? ResultOk(x) : ResultErr(onNull()))

export const ResultMerge: Types.TMergeResultConstructorFn = rs => {
	if (Array.isArray(rs)) {
		return rs.reduce(
			(acc: Types.TResult<any[], any>, r) =>
				acc.pipe(
					R.ops.chain(results =>
						r && (r as Types.TResult<any, any>).is_result
							? (r as Types.TResult<any, any>).cata({
									Ok: v => R.Ok(results.concat(v)),
									Err: R.Err,
								})
							: R.Ok(r),
					),
				),
			R.Ok([] as any[]),
		)
	}

	const keys = Object.keys(rs)

	return keys.reduce(
		(acc: Types.TResult<any[], any>, key) =>
			acc.pipe(
				R.ops.chain(results =>
					(rs as any)[key] && ((rs as any)[key] as Types.TResult<any, any>).is_result
						? ((rs as any)[key] as Types.TResult<any, any>).cata({
								Ok: v => R.Ok({ ...results, [key]: v }),
								Err: R.Err,
							})
						: R.Ok((rs as any)[key]),
				),
			),
		R.Ok({} as any),
	) as any
}

export const map_result: Types.TMapResultOperatorFn = f => r =>
	r.cata({ Ok: x => ResultOk(f(x)), Err: x => ResultErr(x) })

export const err_map_result: Types.TErrMapResultOperatorFn = f => r =>
	r.cata({ Ok: x => ResultOk(x), Err: x => ResultErr(f(x)) })

export const bimap_result: Types.TBiMapResultOperatorFn = (f, g) => r =>
	r.cata({ Ok: x => ResultOk(g(x)), Err: x => ResultErr(f(x)) as any })

export const chain_result: Types.TChainResultOperatorFn = f => r =>
	r.cata({ Ok: x => f(x), Err: x => ResultErr(x) })

export const err_chain_result: Types.TErrChainResultOperatorFn = f => r =>
	r.cata({ Ok: x => ResultOk(x), Err: x => f(x) as any })

export const bichain_result: Types.TBiChainResultOperatorFn = (f, g) => r =>
	r.cata({ Ok: x => g(x), Err: x => f(x) })

export const tap_result: Types.TTapResultOperatorFn = f => r => {
	r.cata({ Ok: x => f(x), Err: () => void 0 })
	return r
}

export const err_tap_result: Types.TErrTapResultOperatorFn = f => r => {
	r.cata({ Ok: () => void 0, Err: x => f(x) })
	return r
}

export const bitap_result: Types.TBiTapResultOperatorFn = (f, g) => r => {
	r.cata({ Ok: x => g(x), Err: x => f(x) })
	return r
}

export const swap_result: Types.TSwapResultOperatorFn = () => r =>
	r.cata({ Ok: x => ResultErr(x), Err: x => ResultOk(x) })

export const ResultIf: Types.TIfResultConstructorFn = (
	orly: boolean,
	{ T = () => undefined as any, F = () => undefined as any } = {
		T: () => undefined as any,
		F: () => undefined as any,
	},
) => (orly ? R.Ok(T()) : R.Err(F()))

export const R: Types.TResultStatic = {
	of: ResultOk,
	Ok: ResultOk,
	Err: ResultErr,
	Try: ResultTry,
	If: ResultIf,
	FromNullable: ResultFromNullable,
	FromOption: ResultFromOption,
	Merge: ResultMerge,
	ops: {
		map: map_result,
		err_map: err_map_result,
		bimap: bimap_result,
		chain: chain_result,
		err_chain: err_chain_result,
		bichain: bichain_result,
		tap: tap_result,
		err_tap: err_tap_result,
		bitap: bitap_result,
		swap: swap_result,
	},
}

export const Result = R
