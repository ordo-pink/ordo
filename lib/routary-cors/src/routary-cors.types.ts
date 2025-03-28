/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Routary } from "@ordo-pink/routary"

export module RoutaryCORS {
	export type Params = {
		allow_origin: string | string[]
		max_age?: number
		success_status?: number
		allow_headers?: string[]
		allow_credentials?: boolean
	}

	export type Instance<$Chamber extends { headers: Headers }> = Parameters<Routary.Instance<$Chamber>["use"]>[0]

	export type Constructor = <$Chamber extends { headers: Headers }>(params: Params) => Instance<$Chamber>
}
