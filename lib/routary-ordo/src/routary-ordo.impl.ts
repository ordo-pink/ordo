/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { type Routary } from "@ordo-pink/routary"

import * as fns from "./fns"
import { RoutaryOrdo } from "./routary-ordo.types"

export const default_handler =
	<$Chamber extends RoutaryOrdo.Chamber>(
		custom_handler: (intake: Routary.Intake<$Chamber>) => Oath<Routary.Intake<$Chamber>, RoutaryOrdo.Rejection>,
	): Routary.Gear<$Chamber> =>
	intake =>
		Oath.Resolve<Routary.Intake<$Chamber>>({
			...intake,
			status: 200,
			headers: intake.headers ?? new Headers(),
		})
			.pipe(ops0.tap(fns.start_response_timer))
			.pipe(ops0.tap(fns.extract_request_ip))
			.pipe(ops0.tap(fns.set_header("Content-Type", "application/json")))
			.pipe(ops0.chain(custom_handler))
			.fix(fns.status_from_rrr)
			.pipe(ops0.tap(fns.stop_response_timer))
			.pipe(ops0.tap(fns.log_request))
			.pipe(ops0.map(fns.create_json_response))
			.invoke(invokers0.force_resolve)
