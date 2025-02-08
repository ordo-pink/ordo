/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { RRR } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { type TDefaultContext } from "@ordo-pink/backend-util-default-handler"
import { type TIntake } from "@ordo-pink/routary"

export const create_json_response = <
	$TResult,
	$TIntake extends TIntake<{ payload?: $TResult; headers: Headers; status: number }>,
>({
	headers,
	payload,
	status,
}: $TIntake): Response => Response.json({ success: status <= 399, payload }, { headers, status })

export const create_response = <$TResult, $TIntake extends TIntake<{ payload?: $TResult; headers: Headers; status: number }>>({
	headers,
	payload,
	status,
}: $TIntake): Response => new Response(payload as any, { headers, status })

type TStatusFromRRRParams<$TContext extends TDefaultContext> = { rrr: Ordo.Rrr; intake: TIntake<$TContext> }
export const status_from_rrr = <$TContext extends TDefaultContext>({
	rrr,
	intake,
}: TStatusFromRRRParams<$TContext>): TIntake<$TContext> => {
	if (intake.headers.get("Content-Type") !== "application/json") {
		intake.headers.set("Content-Type", "application/json")
		intake.payload = JSON.stringify({ success: false, payload: rrr.message })
	} else {
		intake.payload = rrr.message
	}

	intake.status = Switch.Match(rrr.code)
		.case([RRR.enum.EAGAIN, RRR.enum.ENXIO], () => 408)
		.case([RRR.enum.EFBIG, RRR.enum.ENOSPC], () => 413)
		.case(RRR.enum.EINVAL, () => 400)
		.case(RRR.enum.EACCES, () => 401)
		.case(RRR.enum.EPERM, () => 403)
		.case(RRR.enum.ENOENT, () => 404)
		.case(RRR.enum.EEXIST, () => 409)
		.default(() => 500)

	return intake
}
