/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { TDefaultContext } from "@ordo-pink/backend-util-default-handler"
import { TIntake } from "@ordo-pink/routary"

export const start_response_timer = <$TIntake extends TIntake<TDefaultContext>>(intake: $TIntake): void => {
	intake.response_timer = Date.now()
}

export const stop_response_timer = <$TIntake extends TIntake<TDefaultContext>>(intake: $TIntake): void => {
	const end_time = Date.now() - intake.response_timer!

	intake.response_time = end_time.toString()
}

export const set_x_response_time_header = <$TIntake extends TIntake<TDefaultContext>>(intake: $TIntake): void => {
	if (intake.response_time) intake.headers.set("X-Response-Time", intake.response_time)
}
