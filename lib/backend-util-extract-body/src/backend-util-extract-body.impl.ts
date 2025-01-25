/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Oath, ops0 } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"

export const extract_request_body = <T extends TIntake>(intake: T) =>
	Oath.FromPromise(() => intake.req.json()).pipe(ops0.rejected_map(error => unknown_error(error, intake)))

// --- Internal ---

export const unknown_error = <T extends TIntake>(error: unknown, intake: T) => ({
	rrr:
		error instanceof Error
			? RRR.codes.eio(error.message, error.cause, error.name, error.stack)
			: RRR.codes.eio("unknown error", error),
	intake,
})
