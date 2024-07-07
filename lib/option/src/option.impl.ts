// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import * as Types from "./option.types"

const someO: Types.TSomeOptionConstructorFn = value => ({
	isOption: true,
	isSome: true,
	isNone: false,
	unwrap: () => value,
	cata: ({ Some }) => Some(value) as any,
})

const noneO: Types.TNoneOptionConstructorFn = () => ({
	isOption: true,
	isSome: false,
	isNone: true,
	unwrap: () => void 0,
	cata: ({ None }) => None(),
})

const fromNullableO: Types.TFromNullableOptionConstructorFn = value =>
	value != null ? someO(value) : noneO()

const tryO: Types.TTryOptionConstructorFn = f => {
	try {
		return someO(f())
	} catch (_) {
		return noneO()
	}
}

export const Option: Types.TOptionStatic = {
	some: someO,
	none: noneO,
	of: someO,
	fromNullable: fromNullableO,
	try: tryO,
}

export const O = Option
