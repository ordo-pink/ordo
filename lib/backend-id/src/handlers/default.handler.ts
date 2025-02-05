/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { type TGear, type TIntake } from "@ordo-pink/routary"
import { create_response, status_from_rrr } from "@ordo-pink/backend-util-create-response"
import { set_x_response_time_header, start_response_timer, stop_response_timer } from "@ordo-pink/backend-util-response-time"
import { log_request } from "@ordo-pink/backend-util-log-request"
import { set_content_type_application_json_header } from "@ordo-pink/backend-util-set-header"

import { type TIDChamber, type TSharedContext } from "../backend-id.types"
import { extract_request_ip } from "@ordo-pink/backend-util-extract-request-ip"

export const default_handler =
	(
		custom_handler: (
			intake: TIntake<TSharedContext>,
		) => Oath<TIntake<TSharedContext>, { rrr: Ordo.Rrr; intake: TIntake<TSharedContext> }>,
	): TGear<TIDChamber> =>
	intake =>
		Oath.Resolve<TIntake<TSharedContext>>({ ...intake, status: 200, request_ip: null })
			.pipe(ops0.tap(start_response_timer))
			.pipe(ops0.tap(extract_request_ip))
			.pipe(ops0.tap(set_content_type_application_json_header))
			.pipe(ops0.chain(custom_handler))
			.fix(status_from_rrr)
			.pipe(ops0.tap(stop_response_timer))
			.pipe(ops0.tap(set_x_response_time_header))
			.pipe(ops0.tap(log_request))
			.pipe(ops0.map(create_response))
			.invoke(invokers0.force_resolve)
