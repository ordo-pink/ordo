/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export * from "./result.catas"
export * from "./result.ops"

export * as catas from "./result.catas"
export * as ops from "./result.ops"

import type * as Result from "./result.types"
import { chain } from "./result.ops"

export const ok: Result.Ok = x => ({
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

export const of = ok

export const err: Result.Err = x => ({
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

export const try_catch: Result.TryCatch = (t, c = x => x as any) => {
	try {
		return ok(t())
	} catch (e) {
		return err(c(e))
	}
}

export const if_else: Result.IfElse = (
	f: boolean,
	{ on_true = () => undefined as any, on_false = () => undefined as any } = {
		on_true: () => undefined as any,
		on_false: () => undefined as any,
	},
) => (f ? ok(on_true()) : err(on_false()))

export const from_nullable: Result.FromNullable = (x, onNull = () => null as any) => (x != null ? ok(x) : err(onNull()))

export const merge: Result.Merge = rs => {
	if (Array.isArray(rs)) {
		return rs.reduce(
			(acc: Result.Instance<any[], any>, r) =>
				acc.pipe(
					chain(results =>
						r && (r as Result.Instance<any, any>).is_result
							? (r as Result.Instance<any, any>).cata({
									ok: v => ok(results.concat(v)),
									err: err,
								})
							: ok(r),
					),
				),
			ok([] as any[]),
		)
	}

	const keys = Object.keys(rs)

	return keys.reduce(
		(acc: Result.Instance<any[], any>, key) =>
			acc.pipe(
				chain(results =>
					(rs as any)[key] && ((rs as any)[key] as Result.Instance<any, any>).is_result
						? ((rs as any)[key] as Result.Instance<any, any>).cata({
								ok: v => ok({ ...results, [key]: v }),
								err: err,
							})
						: ok((rs as any)[key]),
				),
			),
		ok({} as any),
	) as any
}
