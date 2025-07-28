/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

/*
 * SPDX-FileCopyrightext: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Sweech } from "@ordo-pink/sweech"

export type MatchResultFn = <$Ok, $Err>(result: Result.Instance<$Ok, $Err>) => Sweech.Instance<$Ok | $Err, []>

type ArrayToUnion<$> = $ extends Array<infer U> ? U : $
type RecordToUnion<$ extends Record<string, unknown>> = { [P in keyof $]: $[P] }[keyof $]

export type DoubtfulButOkay<$> = $ extends object & {
	pipe(f: infer F): any
}
	? F extends (x: Result.Instance<infer V, infer _>) => any
		? V
		: never
	: $

export type ErrWhat<$> = $ extends object & {
	pipe(f: infer F): any
}
	? F extends (x: Result.Instance<infer _, infer V>) => any
		? ErrWhat<V>
		: never
	: never

export type OkResultConstructorFn = <$Ok, $Err = never>(ok: $Ok) => Result.Instance<$Ok, $Err>

export type ErrResultConstructorFn = <$Err, $Ok = never>(err: $Err) => Result.Instance<$Ok, $Err>

export type MergeResultConstructorFn = <SomeThings extends readonly unknown[] | [] | Record<string, unknown>>(
	results: SomeThings,
) => Result.Instance<
	SomeThings extends []
		? { -readonly [P in keyof SomeThings]: DoubtfulButOkay<SomeThings[P]> }
		: { [P in keyof SomeThings]: DoubtfulButOkay<SomeThings[P]> },
	SomeThings extends Array<any>
		? ArrayToUnion<{ -readonly [P in keyof SomeThings]: ErrWhat<SomeThings[P]> }>
		: RecordToUnion<{ [P in keyof SomeThings]: ErrWhat<SomeThings[P]> }>
>

export type TryResultConstructorFn = <$Ok, $Err = unknown>(
	trier: () => $Ok,
	catcher?: (error: unknown) => $Err,
) => Result.Instance<$Ok, $Err>

export type FromNullableResultConstructorFn = <$Ok, $Err = null>(
	x?: $Ok | null,
	on_null?: () => $Err,
) => Result.Instance<NonNullable<$Ok>, $Err>

export type IfResultConstructorFn = <$Ok = undefined, $Err = undefined>(
	predicate: boolean,
	returns?: { on_true?: () => $Ok; on_false?: () => $Err },
) => Result.Instance<$Ok, $Err>

export type MapResultOperatorFn = <$Ok, $Err, $NewOk>(
	on_ok: (x: $Ok) => $NewOk,
) => (result: Result.Instance<$Ok, $Err>) => Result.Instance<$NewOk, $Err>

export type ErrMapResultOperatorFn = <$Ok, $Err, $NewRrr>(
	on_err: (x: $Err) => $NewRrr,
) => (result: Result.Instance<$Ok, $Err>) => Result.Instance<$Ok, $NewRrr>

export type BiMapResultOperatorFn = <$Ok, $Err, $NewOk, $NewRrr>(
	on_err: (x: $Err) => $NewRrr,
	on_ok: (x: $Ok) => $NewOk,
) => (result: Result.Instance<$Ok, $Err>) => Result.Instance<$NewOk, $NewRrr>

export type ChainResultOperatorFn = <$Ok, $Err, $NewOk, $NewRrr>(
	on_ok: (x: $Ok) => Result.Instance<$NewOk, $NewRrr>,
) => (result: Result.Instance<$Ok, $Err>) => Result.Instance<$NewOk, $Err | $NewRrr>

export type ErrChainResultOperatorFn = <$Ok, $Err, $NewOk, $NewRrr>(
	on_err: (x: $Err) => Result.Instance<$NewOk, $NewRrr>,
) => (result: Result.Instance<$Ok, $Err>) => Result.Instance<$Ok, $NewRrr>

export type BiChainResultOperatorFn = <$Ok, $Err, $NewOk, $NewRrr>(
	on_err: (x: $Err) => Result.Instance<$NewOk, $NewRrr>,
	on_ok: (x: $Ok) => Result.Instance<$NewOk, $NewRrr>,
) => (result: Result.Instance<$Ok, $Err>) => Result.Instance<$NewOk, $NewRrr>

export type TapResultOperatorFn = <$Ok, $Err>(
	on_ok: (x: $Ok) => any,
) => (result: Result.Instance<$Ok, $Err>) => Result.Instance<$Ok, $Err>

export type ErrTapResultOperatorFn = <$Ok, $Err>(
	on_err: (x: $Err) => any,
) => (result: Result.Instance<$Ok, $Err>) => Result.Instance<$Ok, $Err>

export type BiTapResultOperatorFn = <$Ok, $Err>(
	on_err: (x: $Err) => any,
	on_ok: (x: $Ok) => any,
) => (result: Result.Instance<$Ok, $Err>) => Result.Instance<$Ok, $Err>

export type SwapResultOperatorFn = <$Ok, $Err>() => (result: Result.Instance<$Ok, $Err>) => Result.Instance<$Err, $Ok>

export type IsResultGuardFn<$Ok = unknown, $Err = unknown> = (x: unknown) => x is Result.Instance<$Ok, $Err>

export type IsOkGuardFn = <$Ok, $Err>(x: Result.Instance<$Ok, $Err>) => x is Result.Instance<$Ok, never>

export type IsErrGuardFn = <$Ok, $Err>(x: Result.Instance<$Ok, $Err>) => x is Result.Instance<never, $Err>

export type OrElseCataFn = <$Ok, $Err, _NewErr>(
	on_err: (err: $Err) => _NewErr,
) => { ok: (on_ok: $Ok) => $Ok; err: (err: $Err) => _NewErr }

export type ExpectFn = <$Ok, $Err>(on_err: (err: $Err) => void) => { ok: (on_ok: $Ok) => $Ok; err: (err: $Err) => never }

export type ThrowFn = <$Ok, $Err>() => { ok: (ok: $Ok) => $Ok; err: (err: $Err) => never }

export type IfOkCataFn = <$Ok, $NewOk>(on_ok: (ok: $Ok) => $NewOk) => { ok: (on_ok: $Ok) => $NewOk; err: () => void }

export type OrNothingCata = <$Ok>() => { ok: (ok: $Ok) => $Ok; err: () => undefined }

export type UnwrapOk<$Result> = $Result extends Result.Instance<infer $Ok, any> ? $Ok : never
export type UnwrapErr<$Result> = $Result extends Result.Instance<any, infer $Err> ? $Err : never

export namespace Result {
	export type Instance<$Ok, $Err> = {
		get is_ok(): boolean
		get is_err(): boolean
		get is_result(): true
		/** @deprecated UNSAFE. Use `result.cata` instead. */
		unwrap: () => $Ok | $Err
		pipe: <_NewOk, _NewErr>(operator: (result: Instance<$Ok, $Err>) => Instance<_NewOk, _NewErr>) => Instance<_NewOk, _NewErr>
		cata: <_NewOk, _NewErr>(explosion: { ok: (ok: $Ok) => _NewOk; err: (err: $Err) => _NewErr }) => _NewOk | _NewErr
	}

	export type Static = {
		of: OkResultConstructorFn
		ok: OkResultConstructorFn
		err: ErrResultConstructorFn
		try: TryResultConstructorFn
		if: IfResultConstructorFn
		from_nullable: FromNullableResultConstructorFn
		merge: MergeResultConstructorFn
		guards: {
			is_result: IsResultGuardFn
			is_ok: IsOkGuardFn
			is_err: IsErrGuardFn
		}
		catas: {
			or_nothing: OrNothingCata
			or_else: OrElseCataFn
			if_ok: IfOkCataFn
			expect: ExpectFn
			throw: ThrowFn
		}
		ops: {
			map: MapResultOperatorFn
			err_map: ErrMapResultOperatorFn
			bimap: BiMapResultOperatorFn
			chain: ChainResultOperatorFn
			err_chain: ErrChainResultOperatorFn
			bichain: BiChainResultOperatorFn
			tap: TapResultOperatorFn
			err_tap: ErrTapResultOperatorFn
			bitap: BiTapResultOperatorFn
			swap: SwapResultOperatorFn
		}
	}
}
