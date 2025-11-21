/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import * as lib from "./src/result.impl"

declare global {
	var result: typeof lib
	var r: typeof lib

	namespace Result {
		export type ArrayToUnion<$> = $ extends Array<infer U> ? U : $
		export type RecordToUnion<$ extends Record<string, unknown>> = { [P in keyof $]: $[P] }[keyof $]

		export type DoubtfulButOkay<$> = $ extends { pipe(f: infer F): any }
			? F extends (x: Instance<infer V, infer _>) => any
				? V
				: never
			: $

		export type ErrWhat<$> = $ extends { pipe(f: infer F): any }
			? F extends (x: Instance<infer _, infer V>) => any
				? ErrWhat<V>
				: never
			: never

		export type Ok = <$Ok, $Err = never>(ok: $Ok) => Instance<$Ok, $Err>

		export type Err = <$Err, $Ok = never>(err: $Err) => Instance<$Ok, $Err>

		export type Merge = <SomeThings extends readonly unknown[] | [] | Record<string, unknown>>(
			results: SomeThings,
		) => Instance<
			SomeThings extends []
				? { -readonly [P in keyof SomeThings]: DoubtfulButOkay<SomeThings[P]> }
				: { [P in keyof SomeThings]: DoubtfulButOkay<SomeThings[P]> },
			SomeThings extends Array<any>
				? ArrayToUnion<{ -readonly [P in keyof SomeThings]: ErrWhat<SomeThings[P]> }>
				: RecordToUnion<{ [P in keyof SomeThings]: ErrWhat<SomeThings[P]> }>
		>

		export type TryCatch = <$Ok, $Err = unknown>(trier: () => $Ok, catcher?: (error: unknown) => $Err) => Instance<$Ok, $Err>

		export type FromNullable = <$Ok, $Err = null>(x?: $Ok | null, on_null?: () => $Err) => Instance<NonNullable<$Ok>, $Err>

		export type IfElse = <$Ok = undefined, $Err = undefined>(
			condition: boolean,
			explosion?: { on_true?: () => $Ok; on_false?: () => $Err },
		) => Instance<$Ok, $Err>

		export type Map = <$Ok, $Err, $NewOk>(on_ok: (x: $Ok) => $NewOk) => (result: Instance<$Ok, $Err>) => Instance<$NewOk, $Err>

		export type RMap = <$Ok, $Err, $NewRrr>(
			on_err: (x: $Err) => $NewRrr,
		) => (result: Instance<$Ok, $Err>) => Instance<$Ok, $NewRrr>

		export type BiMap = <$Ok, $Err, $NewOk, $NewRrr>(
			on_err: (x: $Err) => $NewRrr,
			on_ok: (x: $Ok) => $NewOk,
		) => (result: Instance<$Ok, $Err>) => Instance<$NewOk, $NewRrr>

		export type Chain = <$Ok, $Err, $NewOk, $NewRrr>(
			on_ok: (x: $Ok) => Instance<$NewOk, $NewRrr>,
		) => (result: Instance<$Ok, $Err>) => Instance<$NewOk, $Err | $NewRrr>

		export type RChain = <$Ok, $Err, $NewOk, $NewRrr>(
			on_err: (x: $Err) => Instance<$NewOk, $NewRrr>,
		) => (result: Instance<$Ok, $Err>) => Instance<$Ok, $NewRrr>

		export type Tap = <$Ok, $Err>(
			on_ok: (x: $Ok) => any,
			on_err?: (x: $Err) => any,
		) => (result: Instance<$Ok, $Err>) => Instance<$Ok, $Err>

		export type RTap = <$Ok, $Err>(
			on_err: (x: $Err) => any,
			on_ok?: (x: $Ok) => any,
		) => (result: Instance<$Ok, $Err>) => Instance<$Ok, $Err>

		export type Swap = <$Ok, $Err>() => (result: Instance<$Ok, $Err>) => Instance<$Err, $Ok>

		export type OrElse = <const $Ok, const $Err, const _NewErr>(
			on_err: (err: $Err) => _NewErr,
		) => { ok: (on_ok: $Ok) => $Ok; err: (err: $Err) => _NewErr }

		export type Expect = <$Ok, $Err>(on_err: (err: $Err) => void) => { ok: (on_ok: $Ok) => $Ok; err: (err: $Err) => never }

		export type Unwrap = <_Ok, _Err>() => { ok: (ok: _Ok) => _Ok; err: (err: _Err) => _Err }

		export type IfOk = <$Ok, $NewOk>(on_ok: (ok: $Ok) => $NewOk) => { ok: (on_ok: $Ok) => $NewOk; err: () => void }

		export type OrNothing = <$Ok>() => { ok: (ok: $Ok) => $Ok; err: () => undefined }

		export type UnwrapOk<$Result> = $Result extends Instance<infer $Ok, any> ? $Ok : never
		export type UnwrapErr<$Result> = $Result extends Instance<any, infer $Err> ? $Err : never

		export type Instance<$Ok, $Err> = {
			get is_ok(): boolean
			get is_err(): boolean
			get is_result(): true
			pipe: <_NewOk, _NewErr>(operator: (result: Instance<$Ok, $Err>) => Instance<_NewOk, _NewErr>) => Instance<_NewOk, _NewErr>
			cata: <const _NewOk, const _NewErr>(explosion: {
				ok: (ok: $Ok) => _NewOk
				err: (err: $Err) => _NewErr
			}) => _NewOk | _NewErr
		}
	}
}

if (!globalThis.result) globalThis.result = lib
if (!globalThis.r) globalThis.r = lib
