/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { CurrentUser, METADATA_CONTENT_FSID, Metadata, RRR } from "@ordo-pink/core"
import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { routary, Intake } from "@ordo-pink/routary"
import { create_json_response, create_response, status_from_rrr } from "@ordo-pink/backend-util-create-response"
import { set_x_response_time_header, start_response_timer, stop_response_timer } from "@ordo-pink/backend-util-response-time"
import { extract_request_ip } from "@ordo-pink/backend-util-extract-request-ip"
import { log_request } from "@ordo-pink/backend-util-log-request"
import { routary_cors } from "@ordo-pink/routary-cors"
import { set_content_type_application_json_header } from "@ordo-pink/backend-util-set-header"

import { type TPBChamber, type TPBContext } from "./backend-pb.types"
import { BackendUserKeys } from "@ordo-pink/backend/src/backend.constants"

export const create_backend_pb = (chamber: TPBChamber) =>
	routary
		.create<TPBContext>({ ...chamber, headers: new Headers(), request_ip: null, status: 200 })
		.get("/:handle/:fsid", intake => {
			const context = { ...intake, status: 200, request_ip: null, headers: intake.headers ?? new Headers() }

			return (
				Oath.Resolve(context)
					.pipe(ops0.tap(start_response_timer))
					.pipe(ops0.tap(extract_request_ip))
					.pipe(ops0.chain(validate_request_params))
					.pipe(ops0.map(extract_ids(context)))
					.pipe(
						ops0.chain(({ handle, fsid }) =>
							Oath.FromPromise(() => fetch(`${intake.id_host}/users/handle/${handle}`))
								.and(res => res.json())
								.and(res => Oath.If(res.success, { T: () => res.payload as Ordo.User.Public.DTO }))
								.and(user => ({ uid: user[BackendUserKeys.UID], fsid }))
								.pipe(ops0.rejected_map(() => RRR.codes.enoent("User not found"))),
						),
					)
					.pipe(ops0.chain(check_file_exists(context)))
					.pipe(
						ops0.chain(({ uid, fsid }) =>
							intake.data_persistence_strategy
								.read(uid, METADATA_CONTENT_FSID)
								.pipe(ops0.chain(stream => Oath.FromPromise(() => new Response(stream).json() as Promise<Ordo.Metadata.DTO[]>)))
								.pipe(ops0.chain(metadata => Oath.FromNullable(metadata.find(item => item.fsid === fsid))))
								.pipe(ops0.rejected_map(() => RRR.codes.enoent("User metadata not found")))
								.pipe(
									ops0.chain(m =>
										Oath.If(m.props && m.props.public_id, { T: () => m })
											.pipe(ops0.tap(m => intake.headers.set("Last-Modified", new Date(m.updated_at).toUTCString())))
											.pipe(ops0.tap(() => intake.headers.set("Content-Type", "text/html")))
											.pipe(ops0.map(m => ({ uid, fsid: m.props!.public_id })))
											.pipe(ops0.rejected_map(() => RRR.codes.enoent("File not found"))),
									),
								),
						),
					)
					// TODO Check file is public
					.pipe(ops0.chain(({ uid, fsid }) => context.data_persistence_strategy.read(uid, fsid)))
					.pipe(ops0.tap(file => void (context.payload = file)))
					.pipe(ops0.map(() => context))
					.pipe(ops0.rejected_map(rrr => ({ rrr, intake: context })))
					.fix(status_from_rrr)
					.pipe(ops0.tap(stop_response_timer))
					.pipe(ops0.tap(set_x_response_time_header))
					.pipe(ops0.tap(log_request))
					.pipe(ops0.map(create_response))
					.invoke(invokers0.force_resolve)
			)
		})

		.get("/healthcheck", () => new Response("OK"))

		.use(routary_cors({ allow_origin: chamber.allow_origin, allow_headers: ["content-type", "authorization"] }))

		.start(intake =>
			Oath.Resolve<Intake<TPBContext>>({ ...intake, headers: new Headers(), status: 404, request_ip: null })
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

const validate_request_params = (intake: Intake<TPBContext>) =>
	Oath.Merge([
		Oath.If(Metadata.Validations.is_fsid(intake.params.fsid)).pipe(ops0.rejected_map(() => RRR.codes.einval("Invalid FSID"))),
		Oath.If(CurrentUser.Validations.is_handle(intake.params.handle)).pipe(
			ops0.rejected_map(() => RRR.codes.einval("Invalid handle")),
		),
	]).pipe(ops0.map(() => intake))

const check_file_exists =
	(intake: Intake<TPBContext>) =>
	({ uid, fsid }: TIDs) =>
		intake.data_persistence_strategy
			.exists(uid, fsid)
			.pipe(ops0.chain(exists => Oath.If(exists)))
			.pipe(ops0.map(() => ({ uid, fsid })))
			.pipe(ops0.rejected_map(() => RRR.codes.enoent("File not found")))

type TIDs = { uid: Ordo.User.UID; fsid: Ordo.Metadata.FSID }
const extract_ids = (intake: Intake<TPBContext>) => () => ({
	handle: intake.params.handle as Ordo.User.Handle,
	fsid: intake.params.fsid as Ordo.Metadata.FSID,
})
