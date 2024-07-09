// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import {
	type TBiChainResultOperatorFn,
	type TBiMapResultOperatorFn,
	type TBiTapResultOperatorFn,
	type TChainResultOperatorFn,
	type TErrChainResultOperatorFn,
	type TErrMapResultOperatorFn,
	type TErrResultConstructorFn,
	type TErrTapResultOperatorFn,
	type TFromNullableResultConstructorFn,
	type TIfResultConstructorFn,
	type TMapResultOperatorFn,
	type TMergeResultConstructorFn,
	type TOkResultConstructorFn,
	type TResult,
	type TResultStatic,
	type TSwapResultOperatorFn,
	type TTapResultOperatorFn,
	type TTryResultConstructorFn,
} from "./result.types"

export const okR: TOkResultConstructorFn = x => ({
	isOk: true,
	isErr: false,
	isResult: true,
	unwrap: () => x,
	pipe: f => f(okR(x)),
	cata: e => e.Ok(x),
})

export const rrrR: TErrResultConstructorFn = x => ({
	isOk: false,
	isErr: true,
	isResult: true,
	unwrap: () => x,
	pipe: f => f(rrrR(x)),
	cata: e => e.Err(x),
})

export const tryR: TTryResultConstructorFn = (t, c = x => x as any) => {
	try {
		return okR(t())
	} catch (e) {
		return rrrR(c(e))
	}
}

export const fromNullableR: TFromNullableResultConstructorFn = (x, onNull = () => null as any) =>
	x != null ? okR(x) : rrrR(onNull())

export const mapR: TMapResultOperatorFn = f => r =>
	r.cata({ Ok: x => okR(f(x)), Err: x => rrrR(x) })

export const errMapR: TErrMapResultOperatorFn = f => r =>
	r.cata({ Ok: x => okR(x), Err: x => rrrR(f(x)) })

export const bimapR: TBiMapResultOperatorFn = (f, g) => r =>
	r.cata({ Ok: x => okR(g(x)), Err: x => rrrR(f(x)) as any })

export const chainR: TChainResultOperatorFn = f => r => r.cata({ Ok: x => f(x), Err: x => rrrR(x) })

export const errChainR: TErrChainResultOperatorFn = f => r =>
	r.cata({ Ok: x => okR(x), Err: x => f(x) as any })

export const bichainR: TBiChainResultOperatorFn = (f, g) => r =>
	r.cata({ Ok: x => g(x), Err: x => f(x) })

export const tapR: TTapResultOperatorFn = f => r => {
	r.cata({ Ok: x => f(x), Err: () => void 0 })
	return r
}

export const mergeR: TMergeResultConstructorFn = rs => {
	if (Array.isArray(rs)) {
		return rs.reduce(
			(acc: TResult<any[], any>, r) =>
				acc.pipe(
					R.ops.chain(results =>
						r && (r as TResult<any, any>).isResult
							? (r as TResult<any, any>).cata({ Ok: v => R.Ok(results.concat(v)), Err: R.Err })
							: R.Ok(r),
					),
				),
			R.Ok([] as any[]),
		)
	}

	const keys = Object.keys(rs)

	return keys.reduce(
		(acc: TResult<any[], any>, key) =>
			acc.pipe(
				R.ops.chain(results =>
					(rs as any)[key] && ((rs as any)[key] as TResult<any, any>).isResult
						? ((rs as any)[key] as TResult<any, any>).cata({
								Ok: v => R.Ok({ ...results, [key]: v }),
								Err: R.Err,
							})
						: R.Ok((rs as any)[key]),
				),
			),
		R.Ok({} as any),
	) as any
}

export const errTapR: TErrTapResultOperatorFn = f => r => {
	r.cata({ Ok: () => void 0, Err: x => f(x) })
	return r
}

export const bitapR: TBiTapResultOperatorFn = (f, g) => r => {
	r.cata({ Ok: x => g(x), Err: x => f(x) })
	return r
}

export const swapE: TSwapResultOperatorFn = () => r =>
	r.cata({ Ok: x => rrrR(x), Err: x => okR(x) })

export const ifR: TIfResultConstructorFn = (
	orly: boolean,
	{ onT = () => undefined as any, onF = () => undefined as any } = {
		onT: () => undefined as any,
		onF: () => undefined as any,
	},
) => (orly ? okR(onT()) : rrrR(onF()))

export const R: TResultStatic = {
	Ok: okR,
	Err: rrrR,
	try: tryR,
	if: ifR,
	fromNullable: fromNullableR,
	merge: mergeR,
	ops: {
		map: mapR,
		errMap: errMapR,
		bimap: bimapR,
		chain: chainR,
		errChain: errChainR,
		bichain: bichainR,
		tap: tapR,
		errTap: errTapR,
		bitap: bitapR,
		swap: swapE,
	},
}
