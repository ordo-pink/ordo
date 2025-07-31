/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Routary } from "@ordo-pink/routary"
import { core } from "@ordo-pink/sdk-core"
import { oath } from "@ordo-pink/oath"

import { type RoutaryOrdo } from "../../routary-ordo.types"

export const extract_json_body: RoutaryOrdo.ExtractJSONBody = intake =>
	oath.from_promise(() => intake.req.json()).pipe(oath.ops.rmap(error => to_rrr(error, intake)))

// --- Internal ---

const to_rrr = <$Intake extends Routary.Intake>(error: unknown, intake: $Intake) => ({
	rrr: error instanceof Error ? core.rrr.eio("Failed to parse body", error) : core.rrr.eio("unknown error", error),
	intake,
})
