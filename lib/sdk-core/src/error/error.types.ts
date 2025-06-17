/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { RRR } from "./error.constants"

export namespace Rrr {
	export type Type = keyof typeof RRR.TYPE

	export type Instance<$Type extends Rrr.Type = Rrr.Type> = {
		type: (typeof RRR.TYPE)[$Type]
		message: string
		debug: any[]
	}

	export type Create<$Type extends Rrr.Type> = (message: string, ...debug: any) => Rrr.Instance<$Type>

	export type CreateType = <$Type extends Rrr.Type>(type: $Type) => Rrr.Create<$Type>

	export type ToStatusCode = (type: RRR.TYPE) => number

	export type ToReadableType = (type: RRR.TYPE) => Rrr.Type
}
