/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Routary } from "@ordo-pink/routary"
import { oath } from "@ordo-pink/oath"
import { rrr } from "@ordo-pink/core"

import { type RoutaryOrdo } from "../../routary-ordo.types"

export const extract_json_body: RoutaryOrdo.ExtractJSONBody = intake =>
	oath.from_promise(() => intake.req.json()).pipe(oath.ops.rejected_map(error => to_rrr(error, intake)))

// --- Internal ---

const to_rrr = <$Intake extends Routary.Intake>(error: unknown, intake: $Intake) => ({
	rrr: error instanceof Error ? rrr.codes.eio("Failed to parse body", error) : rrr.codes.eio("unknown error", error),
	intake,
})
