// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import * as Types from "./option.types"

export const someO: Types.TSomeOptionConstructorFn = value => ({
	isOption: true,
	isSome: true,
	isNone: false,
	unwrap: () => value,
	cata: ({ Some }) => Some(value) as any,
})

export const noneO: Types.TNoneOptionConstructorFn = () => NONE

export const fromNullableO: Types.TFromNullableOptionConstructorFn = value =>
	value != null ? someO(value) : noneO()

export const Option: Types.TOptionStatic = {
	some: someO,
	none: noneO,
	of: someO,
	fromNullable: fromNullableO,
}

export const O = Option

// --- Internal ---

const NONE: Types.TOption<never> = {
	isOption: true,
	isSome: false,
	isNone: true,
	unwrap: () => void 0,
	cata: ({ None }) => None(),
}
