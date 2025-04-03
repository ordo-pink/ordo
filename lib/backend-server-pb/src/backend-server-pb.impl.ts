/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { CurrentUser, CurrentUserKeys, METADATA_CONTENT_FSID, Metadata, RRR } from "@ordo-pink/core"
import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { Routary, routary } from "@ordo-pink/routary"
import {
	create_response,
	extract_request_ip,
	log_request,
	start_response_timer,
	status_from_rrr,
	stop_response_timer,
} from "@ordo-pink/routary-ordo"
import { TWO_LETTER_LOCALE } from "@ordo-pink/locale"
import { rickroll } from "@ordo-pink/rickroll"
import { routary_cors } from "@ordo-pink/routary-cors"

import { type TPBChamber, type TPBContext } from "./backend-server-pb.types"

export const create_backend_server_pb = (chamber: TPBChamber) =>
	routary
		.create<TPBContext>({ ...chamber, headers: new Headers(), status: 200, request_language: TWO_LETTER_LOCALE.ENGLISH })
		.get("/:handle/:fsid", intake => {
			return (
				Oath.Resolve(intake)
					.pipe(ops0.tap(start_response_timer))
					.pipe(ops0.tap(extract_request_ip))
					.pipe(ops0.chain(validate_request_params))
					.pipe(ops0.map(extract_ids(intake)))
					.pipe(
						ops0.chain(({ handle, fsid }) =>
							Oath.FromPromise(() => fetch(`${intake.id_host}/users/handle/${handle}`))
								.and(res => res.json())
								.and(res => Oath.If(res.success, { T: () => res.payload as Ordo.User.Public.DTO }))
								.and(user => ({ uid: user[CurrentUserKeys.UID], fsid }))
								.pipe(ops0.rejected_map(() => RRR.codes.enoent("User not found"))),
						),
					)
					.pipe(ops0.chain(check_file_exists(intake)))
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
					.pipe(ops0.chain(({ uid, fsid }) => intake.data_persistence_strategy.read(uid, fsid)))
					.pipe(ops0.tap(file => void (intake.payload = file)))
					.pipe(ops0.map(() => intake))
					.pipe(ops0.rejected_map(rrr => ({ rrr, intake: intake })))
					.fix(status_from_rrr)
					.pipe(ops0.tap(stop_response_timer))
					.pipe(ops0.tap(log_request))
					.pipe(ops0.map(create_response))
					.invoke(invokers0.force_resolve)
			)
		})

		.get("/healthcheck", () => new Response("OK"))

		.use(routary_cors({ allow_origin: chamber.allow_origin, allow_headers: ["content-type"] }))

		.start(() => rickroll)

const validate_request_params = (intake: Routary.Intake<TPBContext>) =>
	Oath.Merge([
		Oath.If(Metadata.Validations.is_fsid(intake.params.fsid)).pipe(ops0.rejected_map(() => RRR.codes.einval("Invalid FSID"))),
		Oath.If(CurrentUser.Validations.is_handle(intake.params.handle)).pipe(
			ops0.rejected_map(() => RRR.codes.einval("Invalid handle")),
		),
	]).pipe(ops0.map(() => intake))

const check_file_exists =
	(intake: Routary.Intake<TPBContext>) =>
	({ uid, fsid }: TIDs) =>
		intake.data_persistence_strategy
			.exists(uid, fsid)
			.pipe(ops0.chain(exists => Oath.If(exists)))
			.pipe(ops0.map(() => ({ uid, fsid })))
			.pipe(ops0.rejected_map(() => RRR.codes.enoent("File not found")))

type TIDs = { uid: Ordo.User.UID; fsid: Ordo.Metadata.FSID }
const extract_ids = (intake: Routary.Intake<TPBContext>) => () => ({
	handle: intake.params.handle as Ordo.User.Handle,
	fsid: intake.params.fsid as Ordo.Metadata.FSID,
})
