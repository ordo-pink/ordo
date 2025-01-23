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
		Oath.Resolve<TIntake<TSharedContext>>({ ...intake, headers: {}, status: 200, request_ip: null })
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
