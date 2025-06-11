/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Routary } from "@ordo-pink/routary"

export namespace RoutaryCORS {
	export type Params = {
		allow_origin: string | string[]
		max_age?: number
		success_status?: number
		allow_headers?: string[]
		allow_credentials?: boolean
	}

	export type Instance<$Fuel extends {}> = Parameters<Routary.Instance<$Fuel>["use"]>[0]

	export type Fn = <$Fuel extends {}>(params: Params) => Instance<$Fuel>
}
