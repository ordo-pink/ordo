/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Routary } from "@ordo-pink/routary"
import { sweech } from "@ordo-pink/sweech"
import { rrr } from "@ordo-pink/core"

import { type RoutaryOrdo } from "../../routary-ordo.types"

export const create_json_response = <
	$TResult,
	$TIntake extends Routary.Intake<{ payload?: $TResult; headers: Headers; status: number }>,
>({
	headers,
	payload,
	status,
}: $TIntake): Response => Response.json({ success: status <= 399, payload }, { headers, status })

export const create_response = <
	$TResult,
	$TIntake extends Routary.Intake<{ payload?: $TResult; headers: Headers; status: number }>,
>({
	headers,
	payload,
	status,
}: $TIntake): Response => new Response(payload as any, { headers, status })

type TStatusFromRRRParams<$TContext extends RoutaryOrdo.Fuel> = { rrr: Ordo.Rrr; intake: Routary.Intake<$TContext> }
export const status_from_rrr = <$TContext extends RoutaryOrdo.Fuel>({
	rrr: e,
	intake,
}: TStatusFromRRRParams<$TContext>): Routary.Intake<$TContext> => {
	intake.logger.error(intake.request_id, "ERROR:", e.message)
	intake.logger.debug(intake.request_id, "An error occured:", e.message, ...e.debug)

	if (intake.headers.get("Content-Type") !== "application/json") {
		intake.headers.set("Content-Type", "application/json")
		intake.payload = JSON.stringify({ success: false, payload: e.message })
	} else {
		intake.payload = e.message
	}

	intake.status = sweech
		.match(e.code)
		.case([rrr.type.EAGAIN, rrr.type.ENXIO], () => 408)
		.case([rrr.type.EFBIG, rrr.type.ENOSPC], () => 413)
		.case(rrr.type.EINVAL, () => 400)
		.case(rrr.type.EACCES, () => 401)
		.case(rrr.type.EPERM, () => 403)
		.case(rrr.type.ENOENT, () => 404)
		.case(rrr.type.EEXIST, () => 409)
		.default(() => 500)

	return intake
}
