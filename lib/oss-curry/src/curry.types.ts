/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

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
