/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { CurrentUser, Metadata, RRR } from "@ordo-pink/core"
import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { Routary, TIntake } from "@ordo-pink/routary"
import { create_json_response, create_response, status_from_rrr } from "@ordo-pink/backend-util-create-response"
import { set_x_response_time_header, start_response_timer, stop_response_timer } from "@ordo-pink/backend-util-response-time"
import { extract_request_ip } from "@ordo-pink/backend-util-extract-request-ip"
import { log_request } from "@ordo-pink/backend-util-log-request"
import { routary_cors } from "@ordo-pink/routary-cors"
import { set_content_type_application_json_header } from "@ordo-pink/backend-util-set-header"

import { type TPBChamber, type TPBContext } from "./backend-pb.types"

// TODO Extract colonoscope from Routary
// TODO WebSocket for dt-dt and dt-web notifications
export const create_backend_pb = (chamber: TPBChamber) =>
	Routary.Of<TPBContext>({ ...chamber, headers: new Headers(), request_ip: null, status: 200 })
		.head("/:uid/:fsid", intake => {
			const context = { ...intake, status: 204, request_ip: null, headers: intake.headers ?? new Headers() }

			return Oath.Resolve(context)
				.pipe(ops0.tap(start_response_timer))
				.pipe(ops0.tap(extract_request_ip))
				.pipe(ops0.chain(validate_request_params))
				.pipe(ops0.map(extract_ids(context)))
				.pipe(ops0.chain(check_file_exists(context)))
				.pipe(ops0.chain(set_last_modified_header(context)))
				.pipe(ops0.map(() => context))
				.pipe(ops0.rejected_map(rrr => ({ rrr, intake: context })))
				.fix(status_from_rrr)
				.pipe(ops0.tap(stop_response_timer))
				.pipe(ops0.tap(set_x_response_time_header))
				.pipe(ops0.tap(log_request))
				.pipe(ops0.map(create_response))
				.invoke(invokers0.force_resolve)
		})

		.get("/:uid/:fsid", intake => {
			const context = { ...intake, status: 200, request_ip: null, headers: intake.headers ?? new Headers() }

			return Oath.Resolve(context)
				.pipe(ops0.tap(start_response_timer))
				.pipe(ops0.tap(extract_request_ip))
				.pipe(ops0.chain(validate_request_params))
				.pipe(ops0.map(extract_ids(context)))
				.pipe(ops0.chain(check_file_exists(context)))
				.pipe(ops0.chain(set_last_modified_header(context)))
				.pipe(ops0.chain(({ uid, fsid }) => context.data_persistence_strategy.read(uid, fsid)))
				.pipe(ops0.tap(file => void (context.payload = file)))
				.pipe(ops0.map(() => context))
				.pipe(ops0.tap(context => context.headers.set("Content-Type", "application/octet-stream")))
				.pipe(ops0.rejected_map(rrr => ({ rrr, intake: context })))
				.fix(status_from_rrr)
				.pipe(ops0.tap(stop_response_timer))
				.pipe(ops0.tap(set_x_response_time_header))
				.pipe(ops0.tap(log_request))
				.pipe(ops0.map(create_response))
				.invoke(invokers0.force_resolve)
		})

		.get("/healthcheck", () => new Response("OK"))

		.use(routary_cors({ allow_origin: chamber.allow_origin, allow_headers: ["content-type", "authorization"] }))

		.start(intake =>
			Oath.Resolve<TIntake<TPBContext>>({ ...intake, headers: new Headers(), status: 404, request_ip: null })
				.pipe(ops0.tap(start_response_timer))
				.pipe(ops0.tap(extract_request_ip))
				.pipe(ops0.tap(set_content_type_application_json_header))
				.pipe(ops0.tap(stop_response_timer))
				.pipe(ops0.tap(set_x_response_time_header))
				.pipe(ops0.tap(log_request))
				.pipe(ops0.tap(intake => void (intake.payload = "resource not found")))
				.pipe(ops0.map(create_json_response))
				.invoke(invokers0.force_resolve),
		)

const validate_request_params = (intake: TIntake<TPBContext>) =>
	Oath.Merge([
		Oath.If(Metadata.Validations.is_fsid(intake.params.fsid)).pipe(ops0.rejected_map(() => RRR.codes.einval("Invalid FSID"))),
		Oath.If(CurrentUser.Validations.is_id(intake.params.uid)).pipe(ops0.rejected_map(() => RRR.codes.einval("Invalid UID"))),
	]).pipe(ops0.map(() => intake))

const check_file_exists =
	(intake: TIntake<TPBContext>) =>
	({ uid, fsid }: TIDs) =>
		intake.data_persistence_strategy
			.exists(uid, fsid)
			.pipe(ops0.chain(exists => Oath.If(exists)))
			.pipe(ops0.map(() => ({ uid, fsid })))
			.pipe(ops0.rejected_map(() => RRR.codes.enoent("File not found")))

type TIDs = { uid: Ordo.User.UID; fsid: Ordo.Metadata.FSID }
const extract_ids = (intake: TIntake<TPBContext>) => () => ({
	uid: intake.params.uid as Ordo.User.UID,
	fsid: intake.params.fsid as Ordo.Metadata.FSID,
})

const set_last_modified_header =
	(intake: TIntake<TPBContext>) =>
	({ uid, fsid }: TIDs) =>
		intake.data_persistence_strategy
			.mtime(uid, fsid)
			.pipe(ops0.map(mtime => new Date(mtime)))
			.pipe(ops0.map(date => date.toUTCString()))
			.pipe(ops0.tap(last_modified => intake.headers.set("Last-Modified", last_modified)))
			.pipe(ops0.map(() => ({ uid, fsid })))
