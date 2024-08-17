// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { TResult } from "@ordo-pink/result"

/**
 * A constructor for `Some`.
 *
 * @param value - Generic Option input.
 * @returns `TOption` - Option of `Type`.
 */
export type TSomeOptionConstructorFn = <_TSome>(value: _TSome) => TOption<_TSome>

/**
 * A constructor for `None`. Does not accept a value. `None` is always the
 * same, so it can be compared as with `===`.
 *
 * @returns `TOption` - Option of `never`.
 */
export type TNoneOptionConstructorFn = () => TOption<never>

export type TOrElseOptionFn = <$TSome, $TNone>(
	on_none: () => $TNone,
) => {
	Some: () => $TSome
	None: () => $TNone
}

export type TFromNullableOptionConstructorFn = <$TSome>(
	value?: $TSome | null,
) => TOption<NonNullable<$TSome>>

export type TFromResultOptionConstructorFn = <$TSome>(
	result: TResult<$TSome, any>,
) => TOption<$TSome>

/**
 * Type `Option` represents an optional value. Every `Option` is either `Some`
 * and contains a value, or `None`, and does not.
 */
export type TOptionStatic = {
	/**
	 * @see TOptionStatic.Some
	 */
	of: TSomeOptionConstructorFn

	/**
	 * A constructor for `Some`.
	 *
	 * @param value - Generic Option input.
	 * @returns `TOption` - Option of `Type`.
	 */
	Some: TSomeOptionConstructorFn

	/**
	 * A constructor for `None`. Does not accept a value. `None` is always the
	 * same, so it can be compared as with `===`.
	 *
	 * @returns `TOption` - Option of `never`.
	 */
	None: TNoneOptionConstructorFn

	/**
	 * Creates an `Option` from a nullable value. Creates a `None`, if the value
	 * is nullish (`undefined | null`), or a `Some` otherwise. Inferred `Some`
	 * type will be inferred as `NonNullable`.
	 *
	 * @param Type value - Option input.
	 * @returns `Some<Type> | None`
	 */
	FromNullable: TFromNullableOptionConstructorFn

	FromResult: TFromResultOptionConstructorFn

	ops: {
		map: TOptionMapOperatorFn
		chain: TOptionChainOperatorFn
	}

	catas: {
		or_else: TOrElseOptionFn
	}
}

export type TOptionMapOperatorFn = <$TSome, $TNewSome>(
	on_some: (on_some: $TSome) => $TNewSome,
) => (option: TOption<$TSome>) => TOption<$TNewSome>

export type TOptionChainOperatorFn = <$TSome, $TNewSome>(
	on_some: (option: $TSome) => TOption<$TNewSome>,
) => (option: TOption<$TSome>) => TOption<$TNewSome>

export type TOption<_TSome> = {
	/**
	 * `Option`s are marked with `isOption` -> `true`.
	 *
	 * @readonly Cannot be changed.
	 * @type `true`
	 */
	get is_option(): true

	/**
	 * `Some`s are marked with `isSome` -> `true`.
	 * `None`s are marked with `isSome` -> `false`.
	 *
	 * @readonly Cannot be changed.
	 * @type `boolean`
	 */
	get is_some(): boolean

	/**
	 * `Some`s are marked with `isNone` -> `false`.
	 * `None`s are marked with `isNone` -> `true`.
	 *
	 * @readonly Cannot be changed.
	 * @type `boolean`
	 */
	get is_none(): boolean

	/**
	 * Unsafely extract the contained value when it is a `Some`. If it is `None`,
	 * it returns `undefined`.
	 *
	 * @deprecated - It is safer to use `o.cata` instead.
	 *
	 * @returns `TSome | undefined`
	 */
	unwrap: () => _TSome | undefined

	/**
	 * Safely extract the contained value by providing handlers for cases when it
	 * is a `Some` or a `None`.
	 *
	 * @param explosion - Definition of handling the arms of `TOption`.
	 * @returns Union of return types of the handlers.
	 */
	cata: <TNewSome, TNewNone>(explosion: {
		Some: (some: _TSome) => TNewSome
		None: () => TNewNone
	}) => TNewSome | TNewNone

	pipe: <_TNewSome_>(
		operator: (option: TOption<_TSome>) => TOption<_TNewSome_>,
	) => TOption<_TNewSome_>
}
