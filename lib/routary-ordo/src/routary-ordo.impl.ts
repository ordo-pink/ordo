/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Oath, oath } from "@ordo-pink/oath"
import { type Routary } from "@ordo-pink/routary"

import * as fns from "./fns"
import { RoutaryOrdo } from "./routary-ordo.types"

export const default_handler =
	<$Fuel extends RoutaryOrdo.Fuel>(
		custom_handler: (intake: Routary.Intake<$Fuel>) => Oath.Instance<Routary.Intake<$Fuel>, RoutaryOrdo.Rejection>,
	): Routary.Gear<$Fuel> =>
	intake =>
		oath
			.of<Routary.Intake<$Fuel>>({ ...intake, status: 200, headers: intake.headers ?? new Headers() })
			.pipe(oath.ops.tap(fns.assign_request_id))
			.pipe(oath.ops.tap(fns.assign_request_language))
			.pipe(oath.ops.tap(fns.start_response_timer))
			.pipe(oath.ops.tap(fns.extract_request_ip))
			.pipe(oath.ops.tap(fns.set_header("Content-Type", "application/json")))
			.pipe(oath.ops.chain(custom_handler))
			.pipe(oath.ops.fix(fns.status_from_rrr))
			.pipe(oath.ops.tap(fns.stop_response_timer))
			.pipe(oath.ops.tap(fns.log_request))
			.pipe(oath.ops.map(fns.create_json_response))
			.cata(oath.catas.to_promise())
