/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { type TGear, type TIntake } from "@ordo-pink/routary"
import { create_json_response, status_from_rrr } from "@ordo-pink/backend-util-create-response"
import { set_x_response_time_header, start_response_timer, stop_response_timer } from "@ordo-pink/backend-util-response-time"
import { extract_request_ip } from "@ordo-pink/backend-util-extract-request-ip"
import { log_request } from "@ordo-pink/backend-util-log-request"
import { set_content_type_application_json_header } from "@ordo-pink/backend-util-set-header"

import { TDefaultContext } from "./backend-util-default-handler.types"

export const default_handler =
	<$TContext extends TDefaultContext>(
		custom_handler: (intake: TIntake<$TContext>) => Oath<TIntake<$TContext>, { rrr: Ordo.Rrr; intake: TIntake<$TContext> }>,
	): TGear<$TContext> =>
	intake =>
		Oath.Resolve<TIntake<$TContext>>({ ...intake, status: 200, request_ip: null, headers: intake.headers ?? new Headers() })
			.pipe(ops0.tap(start_response_timer))
			.pipe(ops0.tap(extract_request_ip))
			.pipe(ops0.tap(set_content_type_application_json_header))
			.pipe(ops0.chain(custom_handler))
			.fix(status_from_rrr)
			.pipe(ops0.tap(stop_response_timer))
			.pipe(ops0.tap(set_x_response_time_header))
			.pipe(ops0.tap(log_request))
			.pipe(ops0.map(create_json_response))
			.invoke(invokers0.force_resolve)
