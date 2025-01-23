/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { hrtime } from "node:process"

import { type TBackendUtilResponseTimeExpectedIntake } from "./backend-util-response-time.types"

export const start_response_timer = <$TIntake extends TBackendUtilResponseTimeExpectedIntake>(intake: $TIntake): void => {
	intake.response_timer = hrtime()
}

export const stop_response_timer = <$TIntake extends TBackendUtilResponseTimeExpectedIntake>(intake: $TIntake): void => {
	const end_time = hrtime(intake.response_timer)
	const response_time = end_time[0] * 1e3 + end_time[1] / 1e6

	intake.response_time = response_time.toFixed(3)
}

export const set_x_response_time_header = <$TIntake extends TBackendUtilResponseTimeExpectedIntake>(intake: $TIntake): void => {
	if (intake.response_time) intake.headers["X-Response-Time"] = intake.response_time.toString()
}
