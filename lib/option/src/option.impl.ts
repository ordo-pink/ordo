// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import type * as Types from "./option.types"
import { chainO, mapO } from "./ops"

export const someO: Types.TSomeOptionConstructorFn = value => ({
	isOption: true,
	isSome: true,
	isNone: false,
	unwrap: () => value,
	cata: ({ Some }) => Some(value) as any,
	pipe: operator => operator(someO(value)),
})

export const noneO: Types.TNoneOptionConstructorFn = () => NONE

export const fromNullableO: Types.TFromNullableOptionConstructorFn = value =>
	value != null ? someO(value) : noneO()

export const fromResultO: Types.TFromResultOptionConstructorFn = r =>
	r.cata({ Ok: v => O.some(v), Err: () => O.none() })

export const Option: Types.TOptionStatic = {
	some: someO,
	none: noneO,
	of: someO,
	fromNullable: fromNullableO,
	fromResult: fromResultO,
	ops: {
		map: mapO,
		chain: chainO,
	},
}

export const O = Option

// --- Internal ---

const NONE: Types.TOption<never> = {
	isOption: true,
	isSome: false,
	isNone: true,
	unwrap: () => void 0,
	cata: ({ None }) => None(),
	pipe: operator => operator(NONE),
}
