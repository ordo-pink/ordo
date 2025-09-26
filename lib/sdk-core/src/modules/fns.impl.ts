/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

// --- Impl ---

export const curry = <$Args extends any[], $Result>(fn: (...args: $Args) => $Result): Ordo.Fns.Curry<$Args, $Result> =>
	function curried(...args: $Args): any {
		if (args.length >= fn.length) return fn(...args)
		else return (...args2: any[]) => curried(...([...args, ...args2] as $Args))
	} as any

export const t: Ordo.Fns.T = () => true
export const f: Ordo.Fns.F = () => false
export const n: Ordo.Fns.N = () => null
export const u: Ordo.Fns.U = () => {}
export const v: Ordo.Fns.V = u
export const lazy: Ordo.Fns.Lazy = x => () => x
export const eq: Ordo.Fns.Eq = curry((target, val) => target === val)
export const gt: Ordo.Fns.Gt = curry((min, val) => val > min)
export const lt: Ordo.Fns.Lt = curry((max, val) => val < max)
export const gte: Ordo.Fns.Gte = curry((min, val) => eq(min, val) || gt(min, val))
export const lte: Ordo.Fns.Lte = curry((max, val) => eq(max, val) || lt(max, val))

export const keys_of: Ordo.Fns.KeysOf = o => Object.keys(o) as any
export const fuzzy_check: Ordo.Fns.Fuzz = curry((source, target, ratio) => {
	const clean_source = source.trim().toLowerCase()
	const clean_target = target.trim().toLowerCase()
	let hits = 0

	if (!clean_target || clean_source.indexOf(clean_target) > -1) return true

	for (let i = 0; i < clean_target.length; i++) clean_source.indexOf(clean_target[i]) > -1 ? hits++ : hits--

	return hits / source.length >= ratio
})

export const head = <$Xs extends any[]>(xs: $Xs) => xs.at(0)
export const pipe = <$Arg, $Result>(f: (arg: $Arg) => $Result, ...fs: ((arg: any) => any)[]): Ordo.Fns.Pipe<$Arg, $Result> => {
	const pub_f: any = (arg: any) => [f, ...fs].reduce((r, f) => f(r), arg)
	const _pipe = (new_f: any) => pipe(f, ...fs, new_f)

	pub_f.pipe = _pipe as any

	return pub_f
}

export const contra =
	<$A, $B, $Result>(f: (a: $A) => (b: $B) => $Result) =>
	(b: $B) =>
	(a: $A) =>
		f(a)(b)

export const prop: Ordo.Fns.Prop = key => obj => obj[key]

export const replace: Ordo.Fns.Replace = index => (value, arr) => arr.with(index, value) as any

export const construct: Ordo.Fns.Construct = ctor => ((...args: any[]) => new ctor(...args)) as any

// --- Types ---

declare global {
	namespace Ordo.Fns {
		export type KeysOf = <T extends object>(o: T) => (keyof T)[]
		export type Eq<$T extends number | string | boolean | null | undefined = number | string | boolean | null | undefined> =
			Curry<[target: $T, value: $T], boolean>
		export type Gt = Curry<[min: number, value: number], boolean>
		export type Lt = Curry<[max: number, value: number], boolean>
		export type Gte = Curry<[min: number, value: number], boolean>
		export type Lte = Curry<[max: number, value: number], boolean>
		export type Fuzz = Curry<[source: string, target: string, ratio: number], boolean>
		export type T = () => true
		export type F = () => false
		export type N = () => null
		export type U = () => undefined
		export type V = () => void
		export type Lazy = <$X>(x: $X) => () => $X

		export type Pipe<$InitialArg, $Result> = {
			pipe: <$NewResult>(f: (arg: $Result) => $NewResult) => Pipe<$InitialArg, $NewResult>
			(arg: $InitialArg): $Result
		}

		export type Prop = <$Object extends Record<string, unknown> | any[], $Key extends keyof $Object>(
			prop: $Key,
		) => (obj: $Object) => $Object[$Key]

		export type Replace = <$Arr extends any[], $Index extends number>(index: $Index) => (value: $Arr[$Index], obj: $Arr) => $Arr

		export type Curry<$Args extends any[], $Result> = $Args["length"] extends 0
			? () => $Result
			: <_NewArgs extends PartialTuple<$Args>>(
					...args: _NewArgs extends $Args ? $Args : _NewArgs
				) => _NewArgs["length"] extends $Args["length"] ? $Result : Curry<ExcludeTuple<$Args, _NewArgs>, $Result>

		export type Curried<$Fn extends (...args: any[]) => any> = $Fn extends (...args: infer _Args) => infer _Result
			? Curry<_Args, _Result>
			: never

		export type PartialTuple<$Tuple extends any[]> = $Tuple extends []
			? never
			: $Tuple extends [...infer _Rest, any]
				? $Tuple | PartialTuple<_Rest>
				: $Tuple

		export type ExcludeTuple<$A extends any[], $B extends any[]> = $B extends []
			? $A
			: $A extends readonly [unknown, ...infer _RestA]
				? $B extends readonly [unknown, ...infer _RestB]
					? ExcludeTuple<_RestA, _RestB>
					: never
				: never

		export type Construct = <$Constructor extends { new (...args: any[]): any }>(
			konstructor: $Constructor,
		) => $Constructor extends { new (...args: infer _Args): infer _Result }
			? (...args: _Args) => _Result
			: (...args: any[]) => never
	}
}
