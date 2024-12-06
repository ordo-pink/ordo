/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as Types from "./option.types"

export const OptionSome: Types.TSomeOptionConstructorFn = value => ({
	get is_option() {
		return true as const
	},
	get is_some() {
		return true
	},
	get is_none() {
		return false
	},
	unwrap: () => value,
	cata: ({ Some }) => Some(value) as any,
	pipe: operator => operator(OptionSome(value)),
})

export const OptionNone: Types.TNoneOptionConstructorFn = () => NONE

export const OptionFromNullable: Types.TFromNullableOptionConstructorFn = value =>
	value != null ? OptionSome(value) : OptionNone()

export const OptionFromResult: Types.TFromResultOptionConstructorFn = r => r.cata({ Ok: v => O.Some(v), Err: () => O.None() })

export const chain_option: Types.TOptionChainOperatorFn = f => o => o.cata({ Some: v => f(v), None: () => O.None() })

export const map_option: Types.TOptionMapOperatorFn = f => o => o.cata({ Some: v => O.Some(f(v)), None: () => O.None() })

export const or_else_option: Types.TOrElseOptionFn = <$TSome, $TNone>(f: () => $TNone) => ({
	Some: (x: $TSome) => x,
	None: f,
})

export const O: Types.TOptionStatic = {
	Some: OptionSome,
	None: OptionNone,
	of: OptionSome,
	FromNullable: OptionFromNullable,
	FromResult: OptionFromResult,
	ops: {
		map: map_option,
		chain: chain_option,
	},
	catas: {
		or_else: or_else_option,
	},
}

export const Option = O

// --- Internal ---

const NONE: Types.TOption<never> = {
	get is_option() {
		return true as const
	},
	get is_some() {
		return false
	},
	get is_none() {
		return true
	},
	unwrap: () => void 0,
	cata: ({ None }) => None(),
	pipe: operator => operator(NONE),
}
