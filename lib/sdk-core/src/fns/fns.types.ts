/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Curry } from "@ordo-pink/oss-curry"

export type KeysOf = <T extends object>(o: T) => (keyof T)[]
export type Eq<$T extends number | string | boolean | null | undefined = number | string | boolean | null | undefined> = Curry<
	[target: $T, value: $T],
	boolean
>
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

export type Pipe<$InitialArg, $Result> = {
	pipe: <$NewResult>(f: (arg: $Result) => $NewResult) => Pipe<$InitialArg, $NewResult>
	(arg: $InitialArg): $Result
}

export type Prop = <$Object extends Record<string, unknown> | any[], $Key extends keyof $Object>(
	prop: $Key,
) => (obj: $Object) => $Object[$Key]

export type Replace = <$Arr extends any[], $Index extends number>(index: $Index) => (value: $Arr[$Index], obj: $Arr) => $Arr
