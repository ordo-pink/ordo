/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { CurrentUser, CurrentUserKeys, METADATA_CONTENT_FSID, Metadata, rrr } from "@ordo-pink/core"
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
import { oath } from "@ordo-pink/oath"
import { rickroll } from "@ordo-pink/rickroll"
import { routary_cors } from "@ordo-pink/routary-cors"

import { type TPBChamber, type TPBContext } from "./backend-server-pb.types"

export const create_backend_server_pb = (chamber: TPBChamber) =>
	routary
		.create<TPBContext>({ ...chamber, headers: new Headers(), status: 200, request_language: TWO_LETTER_LOCALE.ENGLISH })
		.get("/:handle/:fsid", intake => {
			return (
				oath
					.of(intake)
					.pipe(oath.ops.tap(start_response_timer))
					.pipe(oath.ops.tap(extract_request_ip))
					.pipe(oath.ops.chain(validate_request_params))
					.pipe(oath.ops.map(extract_ids(intake)))
					.pipe(
						oath.ops.chain(({ handle, fsid }) =>
							oath
								.from_promise(() => fetch(`${intake.id_host}/users/handle/${handle}`))
								.pipe(oath.ops.chain(res => oath.from_promise(() => res.json())))
								.pipe(oath.ops.chain(res => oath.if(res.success, { on_true: () => res.payload as Ordo.User.Public.DTO })))
								.pipe(oath.ops.map(user => ({ uid: user[CurrentUserKeys.UID], fsid })))
								.pipe(oath.ops.rmap(() => rrr.codes.enoent("User not found"))),
						),
					)
					.pipe(oath.ops.chain(check_file_exists(intake)))
					.pipe(
						oath.ops.chain(({ uid, fsid }) =>
							intake.data_persistence_strategy
								.read(uid, METADATA_CONTENT_FSID)
								.pipe(
									oath.ops.chain(stream =>
										oath.from_promise(() => new Response(stream).json() as Promise<Ordo.Metadata.DTO[]>),
									),
								)
								.pipe(oath.ops.chain(metadata => oath.from_nullable(metadata.find(item => item.fsid === fsid))))
								.pipe(oath.ops.rmap(() => rrr.codes.enoent("User metadata not found")))
								.pipe(
									oath.ops.chain(m =>
										oath
											.if(m.props && m.props.public_id, { on_true: () => m })
											.pipe(oath.ops.tap(m => intake.headers.set("Last-Modified", new Date(m.updated_at).toUTCString())))
											.pipe(oath.ops.tap(() => intake.headers.set("Content-Type", "text/html")))
											.pipe(oath.ops.map(m => ({ uid, fsid: m.props!.public_id })))
											.pipe(oath.ops.rmap(() => rrr.codes.enoent("File not found"))),
									),
								),
						),
					)
					// TODO Check file is public
					.pipe(oath.ops.chain(({ uid, fsid }) => intake.data_persistence_strategy.read(uid, fsid)))
					.pipe(oath.ops.tap(file => void (intake.payload = file)))
					.pipe(oath.ops.map(() => intake))
					.pipe(oath.ops.rmap(rrr => ({ rrr, intake: intake })))
					.pipe(oath.ops.fix(status_from_rrr))
					.pipe(oath.ops.tap(stop_response_timer))
					.pipe(oath.ops.tap(log_request))
					.pipe(oath.ops.map(create_response))
					.cata(oath.catas.unwrap())
			)
		})

		.get("/healthcheck", () => new Response("OK"))

		.use(routary_cors({ allow_origin: chamber.allow_origin, allow_headers: ["content-type"] }))

		.start(() => rickroll)

const validate_request_params = (intake: Routary.Intake<TPBContext>) =>
	oath
		.all([
			oath.if(Metadata.Validations.is_fsid(intake.params.fsid)).pipe(oath.ops.rmap(() => rrr.codes.einval("Invalid FSID"))),
			oath
				.if(CurrentUser.Validations.is_handle(intake.params.handle))
				.pipe(oath.ops.rmap(() => rrr.codes.einval("Invalid handle"))),
		])
		.pipe(oath.ops.map(() => intake))

const check_file_exists =
	(intake: Routary.Intake<TPBContext>) =>
	({ uid, fsid }: TIDs) =>
		intake.data_persistence_strategy
			.exists(uid, fsid)
			.pipe(oath.ops.chain(exists => oath.if(exists)))
			.pipe(oath.ops.map(() => ({ uid, fsid })))
			.pipe(oath.ops.rmap(() => rrr.codes.enoent("File not found")))

type TIDs = { uid: Ordo.User.UID; fsid: Ordo.Metadata.FSID }
const extract_ids = (intake: Routary.Intake<TPBContext>) => () => ({
	handle: intake.params.handle as Ordo.User.Handle,
	fsid: intake.params.fsid as Ordo.Metadata.FSID,
})
