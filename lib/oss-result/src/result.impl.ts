/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { is_bool, is_false, is_fn, is_object, is_true, noop } from "@ordo-pink/_tau"

import type * as Types from "./result.types"

const ok: Types.OkResultConstructorFn = x => ({
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
	pipe: f => f(ok(x)),
	cata: e => e.ok(x),
})

const err: Types.ErrResultConstructorFn = x => ({
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
	pipe: f => f(err(x)),
	cata: e => e.err(x),
})

const try_catch: Types.TryResultConstructorFn = (t, c = x => x as any) => {
	try {
		return ok(t())
	} catch (e) {
		return err(c(e))
	}
}

const from_nullable: Types.FromNullableResultConstructorFn = (x, onNull = () => null as any) =>
	x != null ? ok(x) : err(onNull())

const merge: Types.MergeResultConstructorFn = rs => {
	if (Array.isArray(rs)) {
		return rs.reduce(
			(acc: Types.Result.Instance<any[], any>, r) =>
				acc.pipe(
					result.ops.chain(results =>
						r && (r as Types.Result.Instance<any, any>).is_result
							? (r as Types.Result.Instance<any, any>).cata({
									ok: v => result.ok(results.concat(v)),
									err: result.err,
								})
							: result.ok(r),
					),
				),
			result.ok([] as any[]),
		)
	}

	const keys = Object.keys(rs)

	return keys.reduce(
		(acc: Types.Result.Instance<any[], any>, key) =>
			acc.pipe(
				result.ops.chain(results =>
					(rs as any)[key] && ((rs as any)[key] as Types.Result.Instance<any, any>).is_result
						? ((rs as any)[key] as Types.Result.Instance<any, any>).cata({
								ok: v => result.ok({ ...results, [key]: v }),
								err: result.err,
							})
						: result.ok((rs as any)[key]),
				),
			),
		result.ok({} as any),
	) as any
}

const cata_result_or_nothing: Types.OrNothingCata = () => ({ ok: x => x, err: () => void 0 })

const cata_result_expect: Types.ExpectFn = f => ({ ok: x => x, err: x => f(x) as never })

const cata_result_throw: Types.ThrowFn = () => ({
	ok: x => x,
	err: e => {
		throw e
	},
})

const cata_result_or_else: Types.OrElseCataFn = f => ({ ok: x => x, err: x => f(x) })

const cata_result_if_ok: Types.IfOkCataFn = f => ({ ok: x => f(x), err: noop })

const map_result: Types.MapResultOperatorFn = f => r => r.cata({ ok: x => ok(f(x)), err: x => err(x) })

const err_map_result: Types.ErrMapResultOperatorFn = f => r => r.cata({ ok: x => ok(x), err: x => err(f(x)) })

const bimap_result: Types.BiMapResultOperatorFn = (f, g) => r => r.cata({ ok: x => ok(g(x)), err: x => err(f(x)) as any })

const chain_result: Types.ChainResultOperatorFn = f => r => r.cata({ ok: x => f(x), err: x => err(x) })

const err_chain_result: Types.ErrChainResultOperatorFn = f => r => r.cata({ ok: x => ok(x), err: x => f(x) as any })

const bichain_result: Types.BiChainResultOperatorFn = (f, g) => r => r.cata({ ok: x => g(x), err: x => f(x) })

const tap_result: Types.TapResultOperatorFn = f => r => {
	r.cata({ ok: x => f(x), err: () => void 0 })
	return r
}

const err_tap_result: Types.ErrTapResultOperatorFn = f => r => {
	r.cata({ ok: () => void 0, err: x => f(x) })
	return r
}

const bitap_result: Types.BiTapResultOperatorFn = (f, g) => r => {
	r.cata({ ok: x => g(x), err: x => f(x) })
	return r
}

const swap_result: Types.SwapResultOperatorFn = () => r => r.cata({ ok: x => err(x), err: x => ok(x) })

const if_else: Types.IfResultConstructorFn = (
	orly: boolean,
	{ on_true = () => undefined as any, on_false = () => undefined as any } = {
		on_true: () => undefined as any,
		on_false: () => undefined as any,
	},
) => (orly ? result.ok(on_true()) : result.err(on_false()))

const is_result_guard = <$TOk = unknown, $TErr = unknown>(x: unknown): x is Types.Result.Instance<$TOk, $TErr> => {
	if (!is_object(x)) return false

	const y = x as Types.Result.Instance<any, any>

	return is_true(y.is_result) && is_bool(y.is_err) && is_bool(y.is_ok) && is_fn(y.cata) && is_fn(y.pipe) && is_fn(y.unwrap)
}

const is_ok_guard = <_TOk, _TErr>(x: Types.Result.Instance<_TOk, _TErr>): x is Types.Result.Instance<_TOk, never> =>
	is_result_guard(x) && is_true(x.is_ok) && is_false(x.is_err)

const is_err_guard = <_TOk, _TErr>(x: Types.Result.Instance<_TOk, _TErr>): x is Types.Result.Instance<never, _TErr> =>
	is_result_guard(x) && is_false(x.is_ok) && is_true(x.is_err)

export const result: Types.Result.Static = {
	of: ok,
	ok,
	err,
	try: try_catch,
	if: if_else,
	from_nullable,
	merge,
	catas: {
		if_ok: cata_result_if_ok,
		or_else: cata_result_or_else,
		or_nothing: cata_result_or_nothing,
		expect: cata_result_expect,
		throw: cata_result_throw,
	},
	guards: {
		is_result: is_result_guard,
		is_ok: is_ok_guard,
		is_err: is_err_guard,
	},
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
