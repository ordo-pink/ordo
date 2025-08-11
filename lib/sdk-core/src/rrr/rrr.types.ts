/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Curry } from "@ordo-pink/oss-curry"

import type * as RRR from "./rrr.constants"

export type Type = keyof typeof RRR.TYPE

export type Instance<$Type extends Type = Type> = {
	type: (typeof RRR.TYPE)[$Type]
	message: string | number
	debug: any[]
}

export type Create<$Type extends Type> = Curry<[message: string | number, info: any], Instance<$Type>>

export type CreateType = <$Type extends Type>(type: $Type) => Create<$Type>

export type ToStatusCode = (type: RRR.TYPE) => number

export type ToReadableType = (type: RRR.TYPE) => Type
