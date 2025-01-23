/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { RRR } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { type TIntake } from "@ordo-pink/routary"
import { TSharedContext } from "@ordo-pink/backend-id"

export const create_response = <
	$TResult,
	$TIntake extends TIntake<{ payload?: $TResult; headers: Record<string, string>; status: number }>,
>({
	headers,
	payload,
	status,
}: $TIntake): Response => new Response(JSON.stringify({ success: status <= 399, payload }), { headers, status })

type TStatusFromRRRParams = { rrr: Ordo.Rrr; intake: TIntake<TSharedContext> }
export const status_from_rrr = ({ rrr, intake }: TStatusFromRRRParams): TIntake<TSharedContext> => {
	intake.status = Switch.Match(rrr.code)
		.case([RRR.enum.EAGAIN, RRR.enum.ENXIO], () => 408)
		.case([RRR.enum.EFBIG, RRR.enum.ENOSPC], () => 413)
		.case(RRR.enum.EINVAL, () => 400)
		.case(RRR.enum.EACCES, () => 401)
		.case(RRR.enum.EPERM, () => 403)
		.case(RRR.enum.ENOENT, () => 404)
		.case(RRR.enum.EEXIST, () => 409)
		.default(() => 500)

	intake.payload = rrr.message

	return intake
}
