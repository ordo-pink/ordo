/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { rrr } from "@ordo-pink/core"
import { type Routary } from "@ordo-pink/routary"
import { Switch } from "@ordo-pink/switch"

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

type TStatusFromRRRParams<$TContext extends RoutaryOrdo.Chamber> = { rrr: Ordo.Rrr; intake: Routary.Intake<$TContext> }
export const status_from_rrr = <$TContext extends RoutaryOrdo.Chamber>({
	rrr,
	intake,
}: TStatusFromRRRParams<$TContext>): Routary.Intake<$TContext> => {
	intake.logger.error(intake.request_id, "ERROR:", rrr.message)
	intake.logger.debug(intake.request_id, "An error occured:", rrr.message, ...rrr.debug)

	if (intake.headers.get("Content-Type") !== "application/json") {
		intake.headers.set("Content-Type", "application/json")
		intake.payload = JSON.stringify({ success: false, payload: rrr.message })
	} else {
		intake.payload = rrr.message
	}

	intake.status = Switch.Match(rrr.code)
		.case([rrr.enum.EAGAIN, rrr.enum.ENXIO], () => 408)
		.case([rrr.enum.EFBIG, rrr.enum.ENOSPC], () => 413)
		.case(rrr.enum.EINVAL, () => 400)
		.case(rrr.enum.EACCES, () => 401)
		.case(rrr.enum.EPERM, () => 403)
		.case(rrr.enum.ENOENT, () => 404)
		.case(rrr.enum.EEXIST, () => 409)
		.default(() => 500)

	return intake
}
