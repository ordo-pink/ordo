// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

export type TSomeOptionConstructorFn = <TSome>(value: TSome) => TOption<TSome>
export type TNoneOptionConstructorFn = () => TOption<never>
export type TTryOptionConstructorFn = <TSome>(trier: () => TSome) => TOption<TSome>
export type TFromNullableOptionConstructorFn = <TSome>(
	value?: TSome | null,
) => TOption<NonNullable<TSome>>

export type TOptionStatic = {
	of: TSomeOptionConstructorFn
	some: TSomeOptionConstructorFn
	none: TNoneOptionConstructorFn
	fromNullable: TFromNullableOptionConstructorFn
	try: TTryOptionConstructorFn
}

export type TOption<TSome> = {
	readonly isOption: boolean
	readonly isSome: boolean
	readonly isNone: boolean

	/**
	 * @deprecated
	 */
	unwrap: () => TSome | undefined

	cata: <TNewSome, TNewNone>(explosion: {
		Some: (some: TSome) => TNewSome
		None: () => TNewNone
	}) => TNewSome | TNewNone
}
