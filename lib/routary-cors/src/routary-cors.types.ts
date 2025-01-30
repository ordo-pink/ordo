/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { TRoutary } from "@ordo-pink/routary"

export type TRoutaryCORSParams = {
	allow_origin: string | string[]
	max_age?: number
	success_status?: number
	allow_headers?: string[]
}

export type TRoutaryCORS = <$TChamber extends Record<string, unknown> & { headers: Record<string, string> }>(
	params: TRoutaryCORSParams,
) => Parameters<TRoutary<$TChamber>["use"]>[0]
