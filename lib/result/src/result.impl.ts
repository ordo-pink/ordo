// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { match } from "@ordo-pink/switch"

import {
	type TBiChainResultOperatorFn,
	type TBiMapResultOperatorFn,
	type TBiTapResultOperatorFn,
	type TChainResultOperatorFn,
	type TIfResultConstructorFn,
	type TMapResultOperatorFn,
	type TMatchResultFn,
	type TOkResultConstructorFn,
	type TResultStatic,
	type TRrrChainResultOperatorFn,
	type TRrrMapResultOperatorFn,
	type TRrrResultConstructorFn,
	type TRrrTapResultOperatorFn,
	type TSwapResultOperatorFn,
	type TTapResultOperatorFn,
	type TTryResultConstructorFn,
} from "./result.types"

export const matchR: TMatchResultFn = r => match(r.unwrap())

export const okR: TOkResultConstructorFn = x => ({
	isOk: true,
	isRrr: false,
	isResult: true,
	unwrap: () => x,
	pipe: f => f(okR(x)),
	cata: e => e.ok(x),
})

export const rrrR: TRrrResultConstructorFn = x => ({
	isOk: false,
	isRrr: true,
	isResult: true,
	unwrap: () => x,
	pipe: f => f(rrrR(x)),
	cata: e => e.rrr(x),
})

export const tryR: TTryResultConstructorFn = (t, c = x => x as any) => {
	try {
		return okR(t())
	} catch (e) {
		return rrrR(c(e))
	}
}

export const mapR: TMapResultOperatorFn = f => r =>
	r.cata({ ok: x => okR(f(x)), rrr: x => rrrR(x) })

export const rrrMapR: TRrrMapResultOperatorFn = f => r =>
	r.cata({ ok: x => okR(x), rrr: x => rrrR(f(x)) })

export const bimapR: TBiMapResultOperatorFn = (f, g) => r =>
	r.cata({ ok: x => okR(g(x)), rrr: x => rrrR(f(x)) as any })

export const chainR: TChainResultOperatorFn = f => r => r.cata({ ok: x => f(x), rrr: x => rrrR(x) })

export const rrrChainR: TRrrChainResultOperatorFn = f => r =>
	r.cata({ ok: x => okR(x), rrr: x => f(x) as any })

export const bichainR: TBiChainResultOperatorFn = (f, g) => r =>
	r.cata({ ok: x => g(x), rrr: x => f(x) })

export const tapR: TTapResultOperatorFn = f => r => {
	r.cata({ ok: x => f(x), rrr: () => void 0 })
	return r
}

export const rrrTapR: TRrrTapResultOperatorFn = f => r => {
	r.cata({ ok: () => void 0, rrr: x => f(x) })
	return r
}

export const bitapR: TBiTapResultOperatorFn = (f, g) => r => {
	r.cata({ ok: x => g(x), rrr: x => f(x) })
	return r
}

export const swapE: TSwapResultOperatorFn = () => r =>
	r.cata({ ok: x => rrrR(x), rrr: x => okR(x) })

export const ifR: TIfResultConstructorFn = (
	orly: boolean,
	{ onT = () => undefined as any, onF = () => undefined as any } = {
		onT: () => undefined as any,
		onF: () => undefined as any,
	},
) => (orly ? okR(onT()) : rrrR(onF()))

export const R: TResultStatic = {
	ok: okR,
	rrr: rrrR,
	try: tryR,
	if: ifR,
	operators: {
		map: mapR,
		rrrMap: rrrMapR,
		bimap: bimapR,
		chain: chainR,
		rrrChain: rrrChainR,
		bichain: bichainR,
		tap: tapR,
		rrrTap: rrrTapR,
		bitap: bitapR,
		swap: swapE,
	},
}
